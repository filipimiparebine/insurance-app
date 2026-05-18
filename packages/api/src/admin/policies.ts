import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { policies } from "@blaj/db/schema";
import { eq, desc, and } from "drizzle-orm";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const policyStatusEnum = z.enum(["active", "cancelled", "expired", "pending", "pending_cancellation"]);

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());
const deleteOutput = z.object({ id: z.string() });

export const policiesRouter = b.router({
  list: b
    .input(
      pagination.merge(
        z.object({
          status: policyStatusEnum.optional(),
          policyType: z.string().optional(),
          search: z.string().optional(),
        }),
      ),
    )
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage, status, policyType } = input;
      const { db } = context;

      const conditions = [];
      if (status) conditions.push(eq(policies.status, status));
      if (policyType) conditions.push(eq(policies.policyType as never, policyType as never));

      const where = conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : and(...conditions)
        : undefined;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(policies)
          .where(where)
          .orderBy(desc(policies.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(policies, where),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [policy] = await db
        .select()
        .from(policies)
        .where(eq(policies.id, input.id));

      if (!policy) throw new Error("Policy not found");
      return policy;
    }),

  update: b
    .input(
      z.object({
        id: z.string().uuid(),
        status: policyStatusEnum.optional(),
        cancelledAt: z.string().datetime().optional(),
        cancellationReason: z.string().optional(),
      }),
    )
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { id, ...data } = input;
      const [policy] = await db
        .update(policies)
        .set(data as never)
        .where(eq(policies.id, id))
        .returning();

      if (!policy) throw new Error("Policy not found");
      return policy;
    }),

  delete: b
    .input(z.object({ id: z.string().uuid() }))
    .output(deleteOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      await db.delete(policies).where(eq(policies.id, input.id));
      return { id: input.id };
    }),
});
