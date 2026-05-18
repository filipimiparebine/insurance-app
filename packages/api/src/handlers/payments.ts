import type { Db } from "@blaj/db";
import { eq } from "drizzle-orm";
import { payments, policies } from "@blaj/db/schema";
import { createPaymentIntent } from "../lib/stripe";
import { cancelAndRefundPolicy } from "../webhooks/stripe";
import type {
  CreatePaymentIntentInput,
  CancelWithRefundInput,
} from "../contracts/payments";

export async function createPaymentIntentHandler(
  db: Db,
  input: CreatePaymentIntentInput,
) {
  const metadata = {
    quoteOfferId: input.quoteOfferId,
    source: "blaj_web",
  };

  const pi = await createPaymentIntent({
    amount: input.amount,
    currency: input.currency,
    customerId: input.customerId,
    metadata,
  });

  await db.insert(payments).values({
    userId: input.userId,
    quoteOfferId: input.quoteOfferId,
    stripePaymentIntentId: pi.id,
    amount: input.amount.toString(),
    currency: input.currency,
    status: "pending",
    paymentMethod: "card",
    createdAt: new Date(),
  });

  return {
    clientSecret: pi.client_secret,
    paymentIntentId: pi.id,
  };
}

export async function getPaymentHandler(
  db: Db,
  input: { paymentId: string },
) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, input.paymentId));

  if (!payment) throw new Error("Payment not found");
  return payment;
}

export async function cancelWithRefundHandler(
  db: Db,
  input: CancelWithRefundInput,
) {
  return cancelAndRefundPolicy(db, input.policyId, input.reason);
}
