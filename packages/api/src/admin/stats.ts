import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { policies, payments, users } from "@blaj/db/schema";
import { eq, sql } from "drizzle-orm";

const dashboardOutput = z.object({
  totalPolicies: z.number(),
  activePolicies: z.number(),
  totalUsers: z.number(),
  totalRevenueRON: z.number(),
  pendingCancellations: z.number(),
});

export const statsRouter = b.router({
  dashboard: b
    .output(dashboardOutput)
    .handler(async ({ context }) => {
      const { db } = context;

      const [
        policyCount,
        activePolicies,
        userCount,
        totalRevenue,
        pendingCancellations,
      ] = await Promise.all([
        db.$count(policies),
        db.$count(policies, eq(policies.status, "active")),
        db.$count(users),
        db
          .select({ sum: sql<number>`coalesce(sum(${payments.amount}), 0)` })
          .from(payments)
          .where(eq(payments.status, "succeeded"))
          .then((r) => r[0]?.sum ?? 0),
        db.$count(policies, eq(policies.status, "pending_cancellation")),
      ]);

      return {
        totalPolicies: policyCount,
        activePolicies,
        totalUsers: userCount,
        totalRevenueRON: totalRevenue,
        pendingCancellations,
      };
    }),
});
