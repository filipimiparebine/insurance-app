import { NextResponse } from "next/server"
import { resolveLocalUserId, getDb } from "@/lib/db"
import { getProfileHandler, updatePreferencesHandler, deleteAccountHandler } from "@blaj/api/handlers"

export async function GET() {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = getDb()
    const result = await getProfileHandler(db, { userId })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const db = getDb()
    const result = await updatePreferencesHandler(db, {
      userId,
      preferences: body.preferences,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await resolveLocalUserId()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const db = getDb()
    const result = await deleteAccountHandler(db, {
      userId,
      reason: body.reason,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
