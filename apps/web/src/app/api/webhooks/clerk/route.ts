import { NextResponse } from "next/server"
import { handleClerkWebhook } from "@blaj/api/webhooks/clerk"
import { getDb } from "@/lib/db"

export async function POST(req: Request): Promise<Response> {
  const body = await req.text()

  const svixId = req.headers.get("svix-id")
  const svixTimestamp = req.headers.get("svix-timestamp")
  const svixSignature = req.headers.get("svix-signature")

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const db = getDb()

  try {
    await handleClerkWebhook(db, body, svixId, svixTimestamp, svixSignature)
    return NextResponse.json({ received: true })
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid Clerk webhook signature") {
      return new Response("Invalid signature", { status: 400 })
    }
    return new Response(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 },
    )
  }
}
