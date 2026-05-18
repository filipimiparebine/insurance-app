import type { Db } from "@blaj/db";
import { eq } from "drizzle-orm";
import { payments, policies, webhookEvents, users } from "@blaj/db/schema";
import { constructWebhookEvent, refundPaymentIntent } from "../lib/stripe";
import { handlePaymentSuccess } from "../services/policy-engine";
import { dispatchNotification } from "../services/notifications";

async function resolveUserEmail(db: Db, userId: string): Promise<string> {
  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user?.email ?? "customer@example.com";
}

function extractNameFromEmail(email: string): string {
  if (email === "customer@example.com") return "Client";
  return email.split("@")[0]?.replace(/[._-]/g, " ") || "Client";
}

export async function handleStripeWebhook(
  db: Db,
  payload: string,
  signature: string,
): Promise<{ received: boolean }> {
  let event: any;
  try {
    event = await constructWebhookEvent(payload, signature);
  } catch {
    throw new Error("Invalid Stripe webhook signature");
  }

  const [alreadyProcessed] = await db
    .select()
    .from(webhookEvents)
    .where(eq(webhookEvents.eventId, event.id));

  if (alreadyProcessed) return { received: true };

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as { id: string; last_payment_error?: { message?: string } };
      const piId = paymentIntent.id;

      await handlePaymentSuccess(db, piId);

      await db.insert(webhookEvents).values({
        source: "stripe",
        eventId: event.id,
        payload: event as unknown as Record<string, unknown>,
        processedAt: new Date(),
      });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as { id: string; last_payment_error?: { message?: string } };
      const piId = paymentIntent.id;

      await db
        .update(payments)
        .set({
          status: "failed",
          failureReason:
            paymentIntent.last_payment_error?.message ?? "Payment failed",
        })
        .where(eq(payments.stripePaymentIntentId, piId));

      await db.insert(webhookEvents).values({
        source: "stripe",
        eventId: event.id,
        payload: event as unknown as Record<string, unknown>,
        processedAt: new Date(),
      });
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as {
        payment_intent?: string | { id: string };
        amount_refunded: number;
        currency: string;
      };

      if (!charge.payment_intent) break;

      const piId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent.id;

      await db
        .update(payments)
        .set({ status: "refunded" })
        .where(eq(payments.stripePaymentIntentId, piId));

      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, piId));

      if (payment) {
        const [policy] = await db
          .select({ policyNumber: policies.policyNumber })
          .from(policies)
          .where(eq(policies.id, payment.policyId!));

        await db
          .update(policies)
          .set({
            status: "cancelled",
            cancelledAt: new Date(),
            cancellationReason: "Refund processed via Stripe",
          })
          .where(eq(policies.id, payment.policyId!));

        try {
          const [email] = await Promise.all([
            resolveUserEmail(db, payment.userId),
          ]);

          await dispatchNotification(db, {
            userId: payment.userId,
            policyId: payment.policyId ?? undefined,
            channel: "email",
            template: "refund_processed",
            recipient: email,
            data: {
              name: extractNameFromEmail(email),
              policyNumber: policy?.policyNumber ?? "N/A",
              amount: String(Number(charge.amount_refunded) / 100),
              currency: charge.currency.toUpperCase(),
            },
          });
        } catch {
          // non-blocking
        }
      }

      await db.insert(webhookEvents).values({
        source: "stripe",
        eventId: event.id,
        payload: event as unknown as Record<string, unknown>,
        processedAt: new Date(),
      });
      break;
    }

    default: {
      await db.insert(webhookEvents).values({
        source: "stripe",
        eventId: event.id,
        payload: event as unknown as Record<string, unknown>,
        processedAt: new Date(),
      });
    }
  }

  return { received: true };
}

export async function cancelAndRefundPolicy(
  db: Db,
  policyId: string,
  reason: string,
): Promise<{
  refunded: boolean;
  amount?: number;
  currency?: string;
}> {
  const [policy] = await db
    .select()
    .from(policies)
    .where(eq(policies.id, policyId));

  if (!policy) throw new Error("Policy not found");
  if (policy.status === "cancelled") throw new Error("Policy already cancelled");
  if (!policy.paymentId) throw new Error("No payment found for policy");

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, policy.paymentId!));

  if (!payment) throw new Error("Payment not found");

  const now = new Date();
  const withdrawalUntil = policy.withdrawalUntil
    ? new Date(policy.withdrawalUntil as unknown as string)
    : null;
  const isWithinWithdrawal = withdrawalUntil && now <= withdrawalUntil;

  if (isWithinWithdrawal) {
    await refundPaymentIntent(payment.stripePaymentIntentId);
  }

  await db
    .update(policies)
    .set({
      status: "cancelled",
      cancelledAt: now,
      cancellationReason: reason,
    })
    .where(eq(policies.id, policyId));

  await db
    .update(payments)
    .set({ status: isWithinWithdrawal ? "refunded" : "succeeded" })
    .where(eq(payments.id, payment.id));

  try {
    const [email] = await Promise.all([
      resolveUserEmail(db, policy.userId),
    ]);

    await dispatchNotification(db, {
      userId: policy.userId,
      policyId,
      channel: "email",
      template: isWithinWithdrawal ? "refund_processed" : "policy_cancelled",
      recipient: email,
      data: {
        name: extractNameFromEmail(email),
        policyNumber: policy.policyNumber ?? "",
        amount: isWithinWithdrawal ? String(Number(payment.amount ?? 0)) : "0",
        currency: payment.currency ?? "RON",
        reason,
      },
    });
  } catch {
    // non-blocking
  }

  return {
    refunded: isWithinWithdrawal ?? false,
    amount: isWithinWithdrawal ? Number(payment.amount ?? 0) : undefined,
    currency: isWithinWithdrawal ? (payment.currency ?? "RON") : undefined,
  };
}
