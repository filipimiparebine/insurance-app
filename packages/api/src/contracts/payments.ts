import { z } from "zod";

export const createPaymentIntentInput = z.object({
  userId: z.string().uuid(),
  quoteOfferId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default("RON"),
  customerId: z.string().optional(),
});

export const createPaymentIntentOutput = z.object({
  clientSecret: z.string().nullable(),
  paymentIntentId: z.string(),
});

export const getPaymentInput = z.object({
  paymentId: z.string().uuid(),
});

export const getPaymentOutput = z.record(z.string(), z.any());

export const cancelWithRefundInput = z.object({
  policyId: z.string().uuid(),
  reason: z.string().min(1).max(500),
});

export const cancelWithRefundOutput = z.object({
  refunded: z.boolean(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

export type CreatePaymentIntentInput = z.infer<typeof createPaymentIntentInput>;
export type CreatePaymentIntentOutput = z.infer<typeof createPaymentIntentOutput>;
export type GetPaymentInput = z.infer<typeof getPaymentInput>;
export type GetPaymentOutput = z.infer<typeof getPaymentOutput>;
export type CancelWithRefundInput = z.infer<typeof cancelWithRefundInput>;
export type CancelWithRefundOutput = z.infer<typeof cancelWithRefundOutput>;
