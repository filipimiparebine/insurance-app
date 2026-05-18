"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import {
  LayoutDashboard,
  Shield,
  Car,
  Users,
  UserCog,
  LogOut,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = (locale: string) => [
  {
    href: `/${locale}/dashboard`,
    label: "home",
    icon: LayoutDashboard,
    match: (_p: string) => _p === `/${locale}/dashboard`,
  },
  {
    href: `/${locale}/dashboard?tab=policies`,
    label: "policies",
    icon: Shield,
    match: (_p: string) =>
      _p === `/${locale}/dashboard` || _p.startsWith(`/${locale}/dashboard?tab=policies`),
  },
  {
    href: `/${locale}/dashboard?tab=vehicles`,
    label: "vehicles",
    icon: Car,
    match: (_p: string) => false,
  },
  {
    href: `/${locale}/dashboard?tab=people`,
    label: "people",
    icon: Users,
    match: (_p: string) => false,
  },
  {
    href: `/${locale}/dashboard?tab=profile`,
    label: "profile",
    icon: UserCog,
    match: (_p: string) => false,
  },
]

export function DashboardSidebar({ locale }: { locale: string }) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const items = navItems(locale)

  const isActive = (item: (typeof items)[0]) => {
    if (pathname === `/${locale}/dashboard`) {
      return item.label === "home"
    }
    return item.match(pathname)
  }

  const tabLabels: Record<string, string> = {
    home: locale === "ro" ? "Acasă" : "Home",
    policies: locale === "ro" ? "Polițe" : "Policies",
    vehicles: locale === "ro" ? "Vehicule" : "Vehicles",
    people: locale === "ro" ? "Persoane" : "People",
    profile: locale === "ro" ? "Profil" : "Profile",
  }

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-14 items-center gap-2.5 border-b border-neutral-100 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
          <FileText className="h-4 w-4 text-white" />
        </div>
        <Link href={`/${locale}/dashboard`} className="font-display font-semibold text-sm text-brand-primary">
          blaj.io
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon
            const active = isActive(item)

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all duration-fast",
                    active
                      ? "bg-brand-primary text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tabLabels[item.label]}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-100 p-3">
        <button
          onClick={() => signOut({ redirectUrl: `/${locale}` })}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-500 transition-all hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          {locale === "ro" ? "Deconectare" : "Sign out"}
        </button>
      </div>
    </aside>
  )
}
