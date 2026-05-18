import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { payments } from "@blaj/db/schema";
import { eq, desc } from "drizzle-orm";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());

export const paymentsRouter = b.router({
  list: b
    .input(
      pagination.merge(
        z.object({ status: z.string().optional() }),
      ),
    )
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage, status } = input;
      const { db } = context;

      const where = status
        ? eq(payments.status, status as "pending" | "succeeded" | "failed" | "refunded")
        : undefined;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(payments)
          .where(where)
          .orderBy(desc(payments.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(payments, where),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, input.id))
        .limit(1);

      if (!payment) throw new Error("Payment not found");
      return payment;
    }),
});
