import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { leasingCompanies } from "@blaj/db/schema";
import { eq, desc } from "drizzle-orm";

const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());

export const leasingRouter = b.router({
  list: b
    .input(paginationInput)
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(leasingCompanies)
          .orderBy(desc(leasingCompanies.name))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(leasingCompanies),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [company] = await db
        .select()
        .from(leasingCompanies)
        .where(eq(leasingCompanies.id, input.id))
        .limit(1);

      if (!company) throw new Error("Leasing company not found");
      return company;
    }),

  create: b
    .input(
      z.object({
        name: z.string(),
        cui: z.string().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [company] = await db
        .insert(leasingCompanies)
        .values(input)
        .returning();

      return company;
    }),

  update: b
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().optional(),
        cui: z.string().optional(),
        active: z.boolean().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { id, ...data } = input;
      const [company] = await db
        .update(leasingCompanies)
        .set(data)
        .where(eq(leasingCompanies.id, id))
        .returning();

      if (!company) throw new Error("Leasing company not found");
      return company;
    }),

  delete: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [company] = await db
        .delete(leasingCompanies)
        .where(eq(leasingCompanies.id, input.id))
        .returning();

      if (!company) throw new Error("Leasing company not found");
      return company;
    }),
});
