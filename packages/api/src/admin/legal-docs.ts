import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { legalDocuments } from "@blaj/db/schema";
import { eq, desc, sql } from "drizzle-orm";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());
const deleteOutput = z.object({ id: z.string() });
const toggleOutput = z.object({ id: z.string(), active: z.boolean() });

export const legalDocsRouter = b.router({
  list: b
    .input(pagination)
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(legalDocuments)
          .orderBy(desc(legalDocuments.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(legalDocuments),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [doc] = await db
        .select()
        .from(legalDocuments)
        .where(eq(legalDocuments.id, input.id))
        .limit(1);

      if (!doc) throw new Error("Legal document not found");
      return doc;
    }),

  create: b
    .input(
      z.object({
        type: z.string(),
        version: z.number().int().positive(),
        contentUrl: z.string(),
        effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        active: z.boolean().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const wantsActive = input.active ?? true;
      if (wantsActive) {
        await db
          .update(legalDocuments)
          .set({ active: false })
          .where(eq(legalDocuments.type, input.type));
      }
      const [doc] = await db
        .insert(legalDocuments)
        .values({ ...input, active: wantsActive } as never)
        .returning();
      return doc;
    }),

  update: b
    .input(
      z.object({
        id: z.string().uuid(),
        type: z.string().optional(),
        version: z.number().int().positive().optional(),
        contentUrl: z.string().optional(),
        effectiveDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        active: z.boolean().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { id, ...data } = input;

      if (data.active === true) {
        const [existing] = await db
          .select({ type: legalDocuments.type })
          .from(legalDocuments)
          .where(eq(legalDocuments.id, id))
          .limit(1);
        if (!existing) throw new Error("Legal document not found");
        await db
          .update(legalDocuments)
          .set({ active: false })
          .where(sql`${legalDocuments.type} = ${existing.type} AND ${legalDocuments.active} = true`);
      }

      const [doc] = await db
        .update(legalDocuments)
        .set(data as never)
        .where(eq(legalDocuments.id, id))
        .returning();

      if (!doc) throw new Error("Legal document not found");
      return doc;
    }),

  toggleActive: b
    .input(
      z.object({
        id: z.string().uuid(),
        active: z.boolean(),
      }),
    )
    .output(toggleOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;

      if (input.active) {
        const [existing] = await db
          .select({ type: legalDocuments.type })
          .from(legalDocuments)
          .where(eq(legalDocuments.id, input.id))
          .limit(1);
        if (!existing) throw new Error("Legal document not found");
        await db
          .update(legalDocuments)
          .set({ active: false })
          .where(sql`${legalDocuments.type} = ${existing.type} AND ${legalDocuments.active} = true`);
      }

      const [doc] = await db
        .update(legalDocuments)
        .set({ active: input.active })
        .where(eq(legalDocuments.id, input.id))
        .returning();

      if (!doc) throw new Error("Legal document not found");
      return { id: doc.id, active: doc.active! };
    }),

  delete: b
    .input(z.object({ id: z.string().uuid() }))
    .output(deleteOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      await db
        .delete(legalDocuments)
        .where(eq(legalDocuments.id, input.id));
      return { id: input.id };
    }),
});
