import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function requireAuth(locale: string) {
  const { userId } = await auth()
  if (!userId) {
    redirect(`/${locale}/sign-in`)
  }
  return userId
}

export async function getAuthUser() {
  const { userId } = await auth()
  return userId ?? null
}
