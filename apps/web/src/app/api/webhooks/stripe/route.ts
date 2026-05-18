import { NextResponse } from "next/server"
import { handleStripeWebhook } from "@blaj/api/webhooks/stripe"
import { getDb } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 })
  }

  const db = getDb()

  try {
    await handleStripeWebhook(db, body, signature)
    return NextResponse.json({ received: true })
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid Stripe webhook signature") {
      return new Response("Invalid signature", { status: 400 })
    }
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 },
    )
  }
}
