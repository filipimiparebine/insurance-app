import { z } from "zod";

export const getPolicyInput = z.object({
  policyId: z.string().uuid(),
});

export const getPolicyOutput = z.record(z.string(), z.any());

export const listPoliciesInput = z.object({
  userId: z.string().uuid(),
  status: z.enum(["active", "cancelled", "expired", "pending", "pending_cancellation"]).optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const listPoliciesOutput = z.array(z.record(z.string(), z.any()));

export const cancelPolicyInput = z.object({
  policyId: z.string().uuid(),
  reason: z.string().min(1).max(500),
});

export const cancelPolicyOutput = z.object({
  refunded: z.boolean(),
  amount: z.number().optional(),
  currency: z.string().optional(),
});

export type GetPolicyInput = z.infer<typeof getPolicyInput>;
export type GetPolicyOutput = z.infer<typeof getPolicyOutput>;
export type ListPoliciesInput = z.infer<typeof listPoliciesInput>;
export type CancelPolicyInput = z.infer<typeof cancelPolicyInput>;
export type CancelPolicyOutput = z.infer<typeof cancelPolicyOutput>;
