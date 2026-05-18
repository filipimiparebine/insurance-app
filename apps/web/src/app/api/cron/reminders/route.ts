import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { processReminders } from "@blaj/api/services/reminders"

export async function GET(request: Request) {
  try {
    const secret = process.env.CRON_SECRET
    if (secret) {
      const authHeader = request.headers.get("authorization")
      if (!authHeader || authHeader !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const db = getDb()
    const result = await processReminders(db)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
