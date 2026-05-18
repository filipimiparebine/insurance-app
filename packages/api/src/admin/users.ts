import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { users, persons, auditLog } from "@blaj/db/schema";
import { eq, desc } from "drizzle-orm";
import { getTier1 } from "@blaj/encryption";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());

const decryptInput = z.object({
  recordId: z.string().uuid(),
  field: z.enum(["cnp", "cui", "id_doc_series", "id_doc_number"]),
  reason: z.string().min(1).max(500),
});

const decryptOutput = z.object({
  value: z.string(),
  field: z.string(),
});

// Map fields to their DB columns in persons table
const FIELD_MAP: Record<string, { encrypted: typeof persons.cnpEncrypted | typeof persons.cuiEncrypted | typeof persons.idDocSeriesEncrypted | typeof persons.idDocNumberEncrypted; wrapped: typeof persons.cnpDekWrapped | typeof persons.cuiEncrypted | typeof persons.idDocSeriesEncrypted | typeof persons.idDocNumberEncrypted }> = {
  cnp: { encrypted: persons.cnpEncrypted, wrapped: persons.cnpDekWrapped },
  cui: { encrypted: persons.cuiEncrypted, wrapped: persons.cuiEncrypted }, // Note: cui has no separate dek_wrapped col; uses same pattern
  id_doc_series: { encrypted: persons.idDocSeriesEncrypted, wrapped: persons.idDocSeriesEncrypted },
  id_doc_number: { encrypted: persons.idDocNumberEncrypted, wrapped: persons.idDocNumberEncrypted },
};

export const usersRouter = b.router({
  list: b
    .input(
      pagination.merge(
        z.object({ search: z.string().optional() }),
      ),
    )
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(users)
          .orderBy(desc(users.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(users),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      if (!user) throw new Error("User not found");
      return user;
    }),

  personsByUser: b
    .input(z.object({ userId: z.string().uuid() }))
    .output(z.array(recordOutput))
    .handler(async ({ input, context }) => {
      const { db } = context;
      const rows = await db
        .select()
        .from(persons)
        .where(eq(persons.userId, input.userId))
        .orderBy(desc(persons.createdAt));
      return rows;
    }),

  decryptPii: b
    .input(decryptInput)
    .output(decryptOutput)
    .handler(async ({ input, context }) => {
      const { db, userId: actorId } = context;

      // Fetch the encrypted record
      const [record] = await db
        .select()
        .from(persons)
        .where(eq(persons.id, input.recordId))
        .limit(1);

      if (!record) throw new Error("Person record not found");

      // Determine which columns to decrypt
      const tier1 = getTier1();
      let ciphertext: Buffer | null = null;
      let dekWrapped: Buffer | null = null;
      let nonce: Buffer | null = null;

      switch (input.field) {
        case "cnp":
          ciphertext = record.cnpEncrypted;
          dekWrapped = record.cnpDekWrapped;
          break;
        case "cui":
          ciphertext = record.cuiEncrypted;
          dekWrapped = record.cuiEncrypted; // Same column — real impl would have separate DEK wrapped
          break;
        case "id_doc_series":
          ciphertext = record.idDocSeriesEncrypted;
          dekWrapped = record.idDocSeriesEncrypted;
          break;
        case "id_doc_number":
          ciphertext = record.idDocNumberEncrypted;
          dekWrapped = record.idDocNumberEncrypted;
          break;
      }

      if (!ciphertext) throw new Error("No encrypted data for this field");

      // For now, use a simulated nonce (first 24 bytes of ciphertext is the nonce in production)
      nonce = ciphertext.subarray(0, 24);
      const actualCiphertext = ciphertext.subarray(24);

      // Decrypt
      const plaintextBuffer = await tier1.decrypt({
        ciphertext: actualCiphertext,
        dekWrapped: dekWrapped ?? Buffer.alloc(0),
        nonce,
      });

      const value = plaintextBuffer.toString("utf-8");

      // Write audit log
      await db.insert(auditLog).values({
        userId: record.userId,
        actorId: actorId ?? "",
        action: "decrypt_pii",
        fieldName: input.field,
        recordId: input.recordId,
        reason: input.reason,
        ipAddress: context.ipAddress ?? "",
        userAgent: context.userAgent ?? "",
      });

      return { value, field: input.field };
    }),
});
