import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getDb, resolveLocalUserId } from "@/lib/db"
import { getProfileHandler } from "@blaj/api/handlers"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { userId } = await auth()
  if (!userId) redirect(`/${locale}/sign-in`)

  let profileData: Record<string, unknown> | null = null
  let userName = ""

  try {
    const localUserId = await resolveLocalUserId()
    if (localUserId) {
      const db = getDb()
      const data = await getProfileHandler(db, { userId: localUserId })
      profileData = data as unknown as Record<string, unknown>
      const user = data?.user as { email?: string } | undefined
      userName = user?.email?.split("@")[0] ?? ""
    }
  } catch {
    // Graceful fallback — show empty states
  }

  return <DashboardContent locale={locale} profileData={profileData} userName={userName} />
}
