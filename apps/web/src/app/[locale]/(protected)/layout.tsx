import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect(`/${locale}/sign-in`)
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)]">
      <DashboardSidebar locale={locale} />
      <main className="flex-1 overflow-y-auto bg-neutral-50 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
