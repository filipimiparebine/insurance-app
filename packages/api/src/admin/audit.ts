import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { auditLog } from "@blaj/db/schema";
import { eq, and, desc, gte, lte, or, like, SQL } from "drizzle-orm";

const pagination = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(25),
});

const listOutput = z.object({ data: z.array(z.record(z.unknown())), total: z.number() });
const recordOutput = z.record(z.unknown());

function addDateCondition(
  conditions: SQL[],
  column: typeof auditLog.createdAt,
  value: string | undefined,
  op: typeof gte | typeof lte,
): void {
  if (!value) return;
  const d = new Date(value);
  if (isNaN(d.getTime())) return;
  if (op === gte) {
    d.setHours(0, 0, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }
  conditions.push(op(column, d));
}

export const auditRouter = b.router({
  list: b
    .input(
      pagination.merge(
        z.object({
          action: z.string().optional(),
          userId: z.string().uuid().optional(),
          from: z.string().optional(),
          to: z.string().optional(),
          search: z.string().optional(),
        }),
      ),
    )
    .output(listOutput)
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const conditions: SQL[] = [];
      if (input.action) conditions.push(eq(auditLog.action, input.action));
      if (input.userId) conditions.push(eq(auditLog.actorId, input.userId));
      addDateCondition(conditions, auditLog.createdAt, input.from, gte);
      addDateCondition(conditions, auditLog.createdAt, input.to, lte);
      if (input.search) {
        const q = `%${input.search}%`;
        const clause = or(
          like(auditLog.actorId, q),
          like(auditLog.userId, q),
          like(auditLog.action, q),
          like(auditLog.fieldName, q),
          like(auditLog.recordId, q),
          like(auditLog.ipAddress, q),
          like(auditLog.reason, q),
        );
        if (clause) conditions.push(clause);
      }

      const where = conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : and(...conditions)
        : undefined;

      const [rows, total] = await Promise.all([
        db
          .select()
          .from(auditLog)
          .where(where)
          .orderBy(desc(auditLog.createdAt))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.$count(auditLog, where),
      ]);

      return { data: rows, total };
    }),

  getOne: b
    .input(z.object({ id: z.string().uuid() }))
    .output(recordOutput)
    .handler(async ({ input, context }) => {
      const { db } = context;
      const [entry] = await db
        .select()
        .from(auditLog)
        .where(eq(auditLog.id, input.id))
        .limit(1);

      if (!entry) throw new Error("Audit log entry not found");
      return entry;
    }),
});
