import { z } from "zod";
import { adminBuilder as b } from "./_builder";
import { policies, documents, payments } from "@blaj/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import { refundPaymentIntent } from "../lib/stripe";

const documentSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
  fileUrl: z.string().nullable(),
  mimeType: z.string().nullable(),
  sizeBytes: z.number().nullable(),
  createdAt: z.string().nullable(),
});

const refundInfoSchema = z.object({
  eligible: z.boolean(),
  withinWithdrawal: z.boolean(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
});

const cancellationItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  policyType: z.string(),
  policyNumber: z.string().nullable(),
  insurerCode: z.string(),
  status: z.string(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  premiumNet: z.string().nullable(),
  totalAmount: z.string().nullable(),
  currency: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  cancellationReason: z.string().nullable(),
  withdrawalUntil: z.string().nullable(),
  createdAt: z.string().nullable(),
  pdfUrl: z.string().nullable(),
  ipidUrl: z.string().nullable(),
  documents: z.array(documentSchema),
  refund: refundInfoSchema,
});

const paginationInput = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(50),
});

const approveInput = z.object({
  policyId: z.string().uuid(),
  processRefund: z.boolean().default(false),
});

const rejectInput = z.object({
  policyId: z.string().uuid(),
  comment: z.string().min(1),
});

export const cancellationsRouter = b.router({
  list: b
    .input(paginationInput)
    .output(z.object({ data: z.array(cancellationItemSchema), total: z.number() }))
    .handler(async ({ input, context }) => {
      const { page, perPage } = input;
      const { db } = context;

      const where = eq(policies.status, "pending_cancellation");

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

      if (rows.length === 0) {
        return { data: [], total };
      }

      const policyIds = rows.map((p) => p.id);
      const paymentIds = rows
        .map((p) => p.paymentId)
        .filter((id): id is string => id !== null);

      const [docs, pays] = await Promise.all([
        db.select().from(documents).where(inArray(documents.policyId, policyIds)),
        paymentIds.length > 0
          ? db.select().from(payments).where(inArray(payments.id, paymentIds))
          : Promise.resolve([] as (typeof payments.$inferSelect)[]),
      ]);

      const docsByPolicy = new Map<string, typeof docs>();
      for (const doc of docs) {
        if (!doc.policyId) continue;
        const arr = docsByPolicy.get(doc.policyId) ?? [];
        arr.push(doc);
        docsByPolicy.set(doc.policyId, arr);
      }

      const paymentById = new Map(pays.map((p) => [p.id, p]));

      const now = new Date();

      const data = rows.map((policy) => {
        const payment = policy.paymentId
          ? paymentById.get(policy.paymentId)
          : undefined;
        const withdrawalUntil = policy.withdrawalUntil
          ? new Date(policy.withdrawalUntil as unknown as string)
          : null;
        const isWithinWithdrawal =
          withdrawalUntil != null && now.getTime() <= withdrawalUntil.getTime();

        const policyDocs =
          docsByPolicy.get(policy.id)?.map((d) => ({
            id: d.id,
            type: d.type,
            fileUrl: d.fileUrl,
            mimeType: d.mimeType,
            sizeBytes: d.sizeBytes,
            createdAt: d.createdAt?.toISOString() ?? null,
          })) ?? [];

        return {
          id: policy.id,
          userId: policy.userId,
          policyType: policy.policyType,
          policyNumber: policy.policyNumber,
          insurerCode: policy.insurerCode,
          status: policy.status as string,
          startDate: policy.startDate as unknown as string | null,
          endDate: policy.endDate as unknown as string | null,
          premiumNet: policy.premiumNet as unknown as string | null,
          totalAmount: policy.totalAmount as unknown as string | null,
          currency: policy.currency,
          cancelledAt: policy.cancelledAt?.toISOString() ?? null,
          cancellationReason: policy.cancellationReason,
          withdrawalUntil: policy.withdrawalUntil as unknown as string | null,
          createdAt: policy.createdAt?.toISOString() ?? null,
          pdfUrl: policy.pdfUrl,
          ipidUrl: policy.ipidUrl,
          documents: policyDocs,
          refund: {
            eligible: isWithinWithdrawal,
            withinWithdrawal: isWithinWithdrawal,
            amount: payment ? Number(payment.amount ?? 0) : null,
            currency: payment?.currency ?? null,
          },
        };
      });

      return { data, total };
    }),

  approve: b
    .input(approveInput)
    .output(z.object({ id: z.string(), refunded: z.boolean() }))
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { policyId, processRefund } = input;

      const [policy] = await db
        .select()
        .from(policies)
        .where(eq(policies.id, policyId));

      if (!policy) throw new Error("Policy not found");
      if (policy.status !== "pending_cancellation")
        throw new Error("Policy is not pending cancellation");

      let refunded = false;

      if (processRefund && policy.paymentId) {
        const [payment] = await db
          .select()
          .from(payments)
          .where(eq(payments.id, policy.paymentId));

        if (payment) {
          const withdrawalUntil = policy.withdrawalUntil
            ? new Date(policy.withdrawalUntil as unknown as string)
            : null;
          const now = new Date();
          const isWithinWithdrawal =
            withdrawalUntil != null &&
            now.getTime() <= withdrawalUntil.getTime();

          if (isWithinWithdrawal) {
            await refundPaymentIntent(payment.stripePaymentIntentId);
            await db
              .update(payments)
              .set({ status: "refunded" })
              .where(eq(payments.id, payment.id));
            refunded = true;
          }
        }
      }

      const now = new Date();
      await db
        .update(policies)
        .set({
          status: "cancelled",
          cancelledAt: now,
          cancellationReason: "approved_by_admin",
        })
        .where(eq(policies.id, policyId));

      return { id: policyId, refunded };
    }),

  reject: b
    .input(rejectInput)
    .output(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const { db } = context;
      const { policyId, comment } = input;

      const [policy] = await db
        .select()
        .from(policies)
        .where(eq(policies.id, policyId));

      if (!policy) throw new Error("Policy not found");
      if (policy.status !== "pending_cancellation")
        throw new Error("Policy is not pending cancellation");

      await db
        .update(policies)
        .set({
          status: "active",
          cancellationReason: `rejected: ${comment}`,
        })
        .where(eq(policies.id, policyId));

      return { id: policyId };
    }),
});
