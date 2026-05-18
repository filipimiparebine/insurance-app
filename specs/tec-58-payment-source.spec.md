# CEO Brief: TEC-58 — Accept Payment Source from Mobile Client

> **Issue:** TEC-58 • **Status:** Scoped • **Date:** 2026-05-18 • **Author:** CEO, Fullstack Forge

---

## 1. Summary

The payment API (`createPaymentIntent`) currently hardcodes `source: "blaj_web"` (Stripe metadata) and `paymentMethod: "card"` (database) regardless of which client originates the request. This means there is no distinction between web and mobile payments in the database, analytics, or support tooling.

TEC-58 makes the API **platform-aware**:
- Accept a `source` field from the calling client (mobile / web).
- Store the source in the database alongside the payment record.
- Populate the existing `paymentMethod` column with the **actual** method used (card, apple_pay, google_pay, link), extracted from Stripe's `payment_intent.succeeded` webhook.

## 2. Current State Assessment

| Area | Details |
|------|---------|
| API Contract | `createPaymentIntentInput` (`contracts/payments.ts`) — no `source` field |
| API Handler | `createPaymentIntentHandler` (`handlers/payments.ts`) — hardcodes `source: "blaj_web"` (metadata) and `paymentMethod: "card"` (DB) |
| DB Schema | `payments` table — has `paymentMethod` column (enum: card, apple_pay, google_pay, link) but NO `source` column; column is populated with "card" always |
| Stripe Webhook | `handleStripeWebhook` (`webhooks/stripe.ts`) — does NOT extract payment method from `payment_intent.succeeded` events |
| Mobile Client | `apps/mobile/app/quote/payment.tsx` — calls `createIntent` without `source` field |
| Web Client | `apps/web/src/components/dashboard/payment-form.tsx` — calls `createIntent` without `source` field |

## 3. User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-TEC58-01 | As a mobile user, when I complete a payment in the Expo app, the system shall record that the payment originated from the mobile platform | P0 |
| US-TEC58-02 | As a web user, when I complete a payment on the website, the system shall record that the payment originated from the web platform | P0 |
| US-TEC58-03 | As a product analyst, I want to segment payments by source (web vs mobile) to measure platform-specific conversion rates and revenue | P1 |
| US-TEC58-04 | As a support agent investigating a disputed payment, I want to know whether the payment was made on web or mobile | P1 |
| US-TEC58-05 | As a developer, I want the actual Stripe payment method used by the customer (card, Apple Pay, Google Pay, Link) stored in the database, not a hardcoded default | P0 |

## 4. EARS-Format Requirements

| # | Requirement |
|---|-------------|
| R1 | When a client calls `createPaymentIntent`, the system shall accept an optional `source` field identifying the originating platform. |
| R2 | When no `source` is provided, the system shall default to `"web"` to maintain backward compatibility with existing clients. |
| R3 | When a payment record is created, the system shall store the `source` value alongside the payment in the database. |
| R4 | When Stripe sends a `payment_intent.succeeded` webhook, the system shall extract the actual payment method used (card, apple_pay, google_pay, link) from the Stripe event data and update the `paymentMethod` column. |
| R5 | The `paymentMethod` column shall NOT be populated by the client or hardcoded — it shall reflect the method confirmed by Stripe. |
| R6 | The Stripe PaymentIntent metadata shall continue to include the source for audit trail purposes, in addition to the database column. |

## 5. Acceptance Criteria

| # | Criteria |
|---|----------|
| AC1 | Given the mobile client calls `createPaymentIntent` with `source: "mobile"`, when the payment record is created, then the database row contains `source = "mobile"`. |
| AC2 | Given the web client calls `createPaymentIntent` without a `source` field, when the payment record is created, then the database row contains `source = "web"` (default). |
| AC3 | Given a payment intent is created with mobile source, when Stripe confirms the payment was completed via Apple Pay, then the database row is updated to `paymentMethod = "apple_pay"` and `status = "succeeded"`. |
| AC4 | Given a payment intent is created with web source, when Stripe confirms the payment was completed via card, then the database row is updated to `paymentMethod = "card"` and `status = "succeeded"`. |
| AC5 | Given a payment intent is created, when the Stripe webhook fires `payment_intent.succeeded` but the payment method cannot be determined from the event, then `paymentMethod` falls back to `"card"` (safe default). |
| AC6 | Given a payment fails ($PATCH failing case), when Stripe sends `payment_intent.payment_failed`, then the `source` field remains unchanged and `paymentMethod` is NOT overwritten. |

## 6. Scope Boundaries

### In Scope
- API contract: add optional `source` field to `createPaymentIntentInput` Zod schema
- DB schema: add `source` column to `payments` table (text, nullable, defaults to `"web"`)
- API handler: accept `source` from input and store it in the database record
- API handler: remove the hardcoded `paymentMethod: "card"` — set `paymentMethod` to null on creation, let the webhook populate it
- Stripe webhook: extract `payment_method_types` from `payment_intent.succeeded` event and update the `paymentMethod` column
- Mobile client: pass `source: "mobile"` in the `createPaymentIntent` call
- Web client: pass `source: "web"` in the `createPaymentIntent` call

### Out of Scope
- Admin dashboard analytics for payment source segmentation (separate TEC issue)
- Cross-platform payment attribution for Stripe Link / saved payment methods
- Source tracking for refunds or cancellations beyond initial payment creation
- Adding source to the `policies` table (payment source is sufficient)
- Real-time payment method display on the thank-you page (webhook is async)

## 7. Non-Functional Requirements

| # | Requirement |
|---|-------------|
| N1 | The `source` field validation shall accept any string (not an enum) to allow future platforms (e.g., "api", "whatsapp_bot") without schema changes. |
| N2 | Webhook extraction of payment method shall add &lt;10ms to webhook processing time. |
| N3 | The `source` column shall be indexed for analytics query performance on payment segmentation. |
| N4 | Missing webhook data (payment method cannot be determined) shall gracefully fall back to `"card"` — never throw or leave payment stuck in pending. |

## 8. Recommended Team Assignment

| Role | Agent | Responsibility |
|------|-------|---------------|
| **Backend Lead** | `87bcea0e` | Review Stripe webhook changes, payment intent lifecycle |
| Node Backend Engineer | `4176de73` | API handler changes: accept source, store in DB, populate paymentMethod from webhook |
| Database Engineer | `12f828bb` | DB migration: add `source` column + index to `payments` table |
| TypeScript Engineer | `f45e0d5d` | oRPC contract update: add `source` to `createPaymentIntentInput` |
| Mobile Engineer | `54cdaad0` | Mobile client: pass `source: "mobile"` in payment intent creation |
| React Engineer | `e459705e` | Web client: pass `source: "web"` in payment intent creation |

## 9. Implementation Order (Recommended)

1. **DB migration** (DB Engineer) — add `source` column + index to `payments`
2. **API contract + handler** (TypeScript + Node Backend) — accept `source`, store in DB, remove hardcoded method
3. **Stripe webhook** (Node Backend) — extract and store actual payment method on `payment_intent.succeeded`
4. **Mobile client** (Mobile Engineer) — pass `source: "mobile"`
5. **Web client** (React Engineer) — pass `source: "web"`

Steps 1-3 are API-only and can ship independently. Steps 4-5 are client changes that depend on the API being deployed.

## 10. Handoff

**To:** CTO (`63bb7c85`)

**Requested actions:**
1. Review the API contract change (`source` field design)
2. Validate the webhook extraction approach for `payment_method_types`
3. Determine DB migration strategy (Drizzle migration file, column type, index)
4. Route child issues to the 6 agents listed in the team assignment
5. Lock implementation order and set blockers between dependent tasks

**Not my job:** The CTO owns the technical plan — whether `source` should be an enum or free text, the exact Stripe API fields to extract, migration strategy, and whether the paymentMethod should be set to null or omitted on creation.
