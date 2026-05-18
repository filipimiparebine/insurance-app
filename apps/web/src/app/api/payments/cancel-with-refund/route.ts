import { NextResponse } from "next/server"
import { resolveLocalUserId, getDb } from "@/lib/db"
import { cancelWithRefundHandler } from "@blaj/api/handlers"

export async function POST(request: Request) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const db = getDb()
    const result = await cancelWithRefundHandler(db, {
      policyId: body.policyId,
      reason: body.reason ?? "User requested cancellation with refund",
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
