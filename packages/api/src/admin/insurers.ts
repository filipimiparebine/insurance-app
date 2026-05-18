import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { insurers, auditLog } from "@blaj/db/schema";
import { eq, desc } from "drizzle-orm";
import { getTier1 } from "@blaj/encryption";
import {
  storeCredentialBlob,
  fetchCredentialBlob,
  deleteCredentialBlob,
  generateSecretId,
} from "../lib/credential-storage";

const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());

export const insurersRouter = b.router({
  list: b
    .input(paginationInput)
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(insurers)
          .orderBy(desc(insurers.name))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(insurers),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ code: z.string() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [insurer] = await db
        .select()
        .from(insurers)
        .where(eq(insurers.code, input.code))
        .limit(1);

      if (!insurer) throw new Error("Insurer not found");
      return insurer;
    }),

  create: b
    .input(
      z.object({
        code: z.string(),
        name: z.string(),
        brokerCommissionPct: z.string().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [insurer] = await db
        .insert(insurers)
        .values(input)
        .returning();

      return insurer;
    }),

  update: b
    .input(
      z.object({
        code: z.string(),
        name: z.string().optional(),
        active: z.boolean().optional(),
        brokerCommissionPct: z.string().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { code, ...data } = input;
      const [insurer] = await db
        .update(insurers)
        .set(data)
        .where(eq(insurers.code, code))
        .returning();

      if (!insurer) throw new Error("Insurer not found");
      return insurer;
    }),

  delete: b
    .input(z.object({ code: z.string() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [existing] = await db
        .select({ code: insurers.code, apiCredentialsSecretId: insurers.apiCredentialsSecretId })
        .from(insurers)
        .where(eq(insurers.code, input.code))
        .limit(1);

      if (!existing) throw new Error("Insurer not found");

      const [insurer] = await db
        .delete(insurers)
        .where(eq(insurers.code, input.code))
        .returning();

      if (existing.apiCredentialsSecretId) {
        void deleteCredentialBlob(existing.apiCredentialsSecretId);
      }

      return insurer;
    }),

  storeCredentials: b
    .input(
      z.object({
        code: z.string(),
        credentials: z.string().min(1),
        reason: z.string().min(1).max(500),
      }),
    )
    .output(z.object({ secretId: z.string() }))
    .handler(async ({ input, context }) => {
      const { db, userId: actorId } = context;

      const [insurer] = await db
        .select()
        .from(insurers)
        .where(eq(insurers.code, input.code))
        .limit(1);

      if (!insurer) throw new Error("Insurer not found");

      const tier1 = getTier1();
      const plaintext = Buffer.from(input.credentials, "utf-8");
      const encrypted = await tier1.encrypt(plaintext);
      const secretId = generateSecretId(input.code);

      await storeCredentialBlob(encrypted, secretId);

      await db
        .update(insurers)
        .set({ apiCredentialsSecretId: secretId })
        .where(eq(insurers.code, input.code));

      await db.insert(auditLog).values({
        userId: "",
        actorId: actorId ?? "",
        action: "store_credentials",
        fieldName: `insurer:${input.code}`,
        recordId: "",
        reason: input.reason,
        ipAddress: context.ipAddress ?? "",
        userAgent: context.userAgent ?? "",
      });

      return { secretId };
    }),

  decryptCredentials: b
    .input(
      z.object({
        code: z.string(),
        reason: z.string().min(1).max(500),
      }),
    )
    .output(z.object({ credentials: z.string().nullable() }))
    .handler(async ({ input, context }) => {
      const { db, userId: actorId } = context;

      const [insurer] = await db
        .select()
        .from(insurers)
        .where(eq(insurers.code, input.code))
        .limit(1);

      if (!insurer) throw new Error("Insurer not found");

      if (!insurer.apiCredentialsSecretId) {
        return { credentials: null };
      }

      await db.insert(auditLog).values({
        userId: "",
        actorId: actorId ?? "",
        action: "decrypt_credentials",
        fieldName: `insurer:${input.code}`,
        recordId: "",
        reason: input.reason,
        ipAddress: context.ipAddress ?? "",
        userAgent: context.userAgent ?? "",
      });

      const encrypted = await fetchCredentialBlob(insurer.apiCredentialsSecretId);
      if (!encrypted) {
        return { credentials: null };
      }

      const tier1 = getTier1();
      const plaintext = await tier1.decrypt(encrypted);
      return { credentials: plaintext.toString("utf-8") };
    }),

  rotateCredentials: b
    .input(
      z.object({
        code: z.string(),
        newCredentials: z.string().min(1),
        reason: z.string().min(1).max(500),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db, userId: actorId } = context;

      const [insurer] = await db
        .select()
        .from(insurers)
        .where(eq(insurers.code, input.code))
        .limit(1);

      if (!insurer) throw new Error("Insurer not found");

      const oldSecretId = insurer.apiCredentialsSecretId;

      const tier1 = getTier1();
      const plaintext = Buffer.from(input.newCredentials, "utf-8");
      const encrypted = await tier1.encrypt(plaintext);
      const secretId = generateSecretId(input.code);

      await storeCredentialBlob(encrypted, secretId);

      const [updated] = await db
        .update(insurers)
        .set({ apiCredentialsSecretId: secretId })
        .where(eq(insurers.code, input.code))
        .returning();

      await db.insert(auditLog).values({
        userId: "",
        actorId: actorId ?? "",
        action: "rotate_credentials",
        fieldName: `insurer:${input.code}`,
        recordId: "",
        reason: input.reason,
        ipAddress: context.ipAddress ?? "",
        userAgent: context.userAgent ?? "",
      });

      if (oldSecretId) {
        void deleteCredentialBlob(oldSecretId);
      }

      return updated;
    }),
});
