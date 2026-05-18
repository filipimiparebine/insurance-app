import { NextResponse } from "next/server"
import { resolveLocalUserId, getDb } from "@/lib/db"
import { listPoliciesHandler, createPaymentIntentHandler } from "@blaj/api/handlers"

export async function GET(request: Request) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") ?? undefined
    const limit = parseInt(searchParams.get("limit") ?? "20", 10)
    const offset = parseInt(searchParams.get("offset") ?? "0", 10)

    const db = getDb()
    const result = await listPoliciesHandler(db, {
      userId,
      status: status as "active" | "cancelled" | "expired" | "pending" | "pending_cancellation" | undefined,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()

    if (body.type === "createPaymentIntent") {
      const db = getDb()
      const result = await createPaymentIntentHandler(db, {
        userId,
        quoteOfferId: body.quoteOfferId,
        amount: body.amount,
        currency: body.currency ?? "RON",
        customerId: body.customerId,
      })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Invalid request type" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
