import { createDb } from "@blaj/db"
import { eq } from "drizzle-orm"
import { users } from "@blaj/db/schema"

let _db: ReturnType<typeof createDb> | null = null

export function getDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error("DATABASE_URL is not set")
    _db = createDb(url)
  }
  return _db
}

export async function resolveLocalUserId(): Promise<string | null> {
  const { auth } = await import("@clerk/nextjs/server")
  const { userId: clerkUserId } = await auth()
  if (!clerkUserId) return null

  const db = getDb()
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))

  return user?.id ?? null
}
