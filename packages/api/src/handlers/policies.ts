import type { Db } from "@blaj/db";
import { eq, and, desc } from "drizzle-orm";
import { policies, rcaPolicyDetails, payments } from "@blaj/db/schema";
import { cancelAndRefundPolicy } from "../webhooks/stripe";
import type {
  GetPolicyInput,
  ListPoliciesInput,
  CancelPolicyInput,
} from "../contracts/policies";

export async function getPolicyHandler(
  db: Db,
  input: GetPolicyInput,
) {
  const [policy] = await db
    .select()
    .from(policies)
    .where(eq(policies.id, input.policyId));

  if (!policy) throw new Error("Policy not found");

  const details = policy.policyType === "rca"
    ? await db
        .select()
        .from(rcaPolicyDetails)
        .where(eq(rcaPolicyDetails.policyId, policy.id))
    : null;

  const [payment] = policy.paymentId
    ? await db
        .select()
        .from(payments)
        .where(eq(payments.id, policy.paymentId))
    : [];

  return { ...policy, details: details?.[0] ?? null, payment: payment ?? null };
}

export async function listPoliciesHandler(
  db: Db,
  input: ListPoliciesInput,
) {
  const conditions = [eq(policies.userId, input.userId)];
  if (input.status) {
    conditions.push(eq(policies.status, input.status));
  }

  const results = await db
    .select()
    .from(policies)
    .where(and(...conditions))
    .orderBy(desc(policies.createdAt))
    .limit(input.limit)
    .offset(input.offset);

  return results;
}

export async function cancelPolicyHandler(
  db: Db,
  input: CancelPolicyInput,
) {
  return cancelAndRefundPolicy(db, input.policyId, input.reason);
}
