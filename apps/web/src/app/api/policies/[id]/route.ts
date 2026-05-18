import { NextResponse } from "next/server"
import { resolveLocalUserId, getDb } from "@/lib/db"
import { getPolicyHandler, cancelPolicyHandler } from "@blaj/api/handlers"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const db = getDb()
    const result = await getPolicyHandler(db, { policyId: id })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const reason = body.reason ?? "User requested cancellation"

    const db = getDb()
    const result = await cancelPolicyHandler(db, { policyId: id, reason })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
