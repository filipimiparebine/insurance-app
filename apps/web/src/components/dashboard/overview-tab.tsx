"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@blaj/ui"
import { Shield, PlusCircle, Car, Users, CreditCard, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PolicyItem {
  id?: string
  policyNumber?: string
  policyType?: string
  status?: string
  premiumAmount?: string
  startDate?: string
  endDate?: string
  insurerCode?: string
  paymentId?: string
}

export function OverviewTab({
  locale,
  profileData,
  userName,
}: {
  locale: string
  profileData: Record<string, unknown> | null
  userName: string
}) {
  const { user } = useUser()
  const displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? userName

  const policies = (profileData?.policies as PolicyItem[] | undefined) ?? []
  const vehicles = (profileData?.vehicles as unknown[] | undefined) ?? []
  const persons = (profileData?.persons as unknown[] | undefined) ?? []

  const activePolicies = policies.filter((p) => p.status === "active")
  const expiringSoon = activePolicies.filter((p) => {
    if (!p.endDate) return false
    const end = new Date(p.endDate)
    const now = new Date()
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft > 0 && daysLeft <= 30
  })

  const isRo = locale === "ro"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 font-display">
          {isRo ? "Bun venit" : "Welcome"}{displayName ? `, ${displayName}` : ""}!
        </h1>
        <p className="mt-1 text-neutral-500">
          {isRo
            ? "Gestionează-ți asigurările dintr-un singur loc."
            : "Manage your insurance from one place."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Shield}
          value={activePolicies.length}
          label={isRo ? "Polițe active" : "Active policies"}
          href={`/${locale}/dashboard`}
        />
        <StatCard
          icon={Car}
          value={vehicles.length}
          label={isRo ? "Vehicule" : "Vehicles"}
          variant="secondary"
        />
        <StatCard
          icon={Users}
          value={persons.length}
          label={isRo ? "Persoane" : "People"}
          variant="secondary"
        />
      </div>

      {expiringSoon.length > 0 && (
        <Card className="border-warning/20 bg-warning-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-warning">
              {isRo ? "Polițe care expiră curând" : "Expiring soon"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringSoon.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">
                    {p.policyNumber ?? "—"} &middot; {p.insurerCode ?? "—"}
                  </span>
                  <span className="text-warning font-medium">
                    {p.endDate
                      ? new Date(p.endDate).toLocaleDateString(
                          isRo ? "ro-RO" : "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold text-neutral-900 font-display mb-3">
          {isRo ? "Ce vrei să faci astăzi?" : "What would you like to do today?"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <QuickActionCard
            icon={PlusCircle}
            title={isRo ? "Asigurare RCA nouă" : "New RCA insurance"}
            description={
              isRo
                ? "Compară 9 oferte și cumpără online."
                : "Compare 9 offers and buy online."
            }
            href={`/${locale}/asigurare`}
          />
          <QuickActionCard
            icon={CreditCard}
            title={isRo ? "Polițele mele" : "My policies"}
            description={
              isRo
                ? "Vezi polițele active și istoricul."
                : "View active and past policies."
            }
            onClick={() => {
              const el = document.querySelector('[data-value="policies"]') as HTMLElement
              el?.click()
            }}
          />
        </div>
      </div>

      {activePolicies.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 font-display mb-3">
            {isRo ? "Polițe recente" : "Recent policies"}
          </h2>
          <div className="space-y-2">
            {activePolicies.slice(0, 3).map((p) => (
              <Card key={p.id} className="hover:border-neutral-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm text-neutral-900">
                        {p.policyType?.toUpperCase() ?? "RCA"} — {p.insurerCode ?? "—"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {p.policyNumber ?? "—"} &middot;{" "}
                        {p.startDate && p.endDate
                          ? `${new Date(p.startDate).toLocaleDateString(isRo ? "ro-RO" : "en-US", { day: "numeric", month: "short" })} — ${new Date(p.endDate).toLocaleDateString(isRo ? "ro-RO" : "en-US", { day: "numeric", month: "short", year: "numeric" })}`
                          : "—"}
                      </p>
                    </div>
                    <StatusBadge status={p.status ?? ""} locale={locale} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  variant = "default",
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number
  label: string
  variant?: "default" | "secondary"
  href?: string
}) {
  const content = (
    <Card className={cn(
      "transition-all duration-fast",
      variant === "default"
        ? "border-brand-primary/20 bg-brand-primary/5 hover:border-brand-primary/40"
        : "hover:border-neutral-300",
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              variant === "default" ? "bg-brand-primary text-white" : "bg-neutral-100 text-neutral-600",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-neutral-900 font-display">{value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  href,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href?: string
  onClick?: () => void
}) {
  const content = (
    <Card className="group cursor-pointer transition-all duration-fast hover:border-brand-primary/40 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-neutral-900">{title}</p>
            <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-300 group-hover:text-brand-primary transition-colors shrink-0 mt-1" />
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return <div onClick={onClick}>{content}</div>
}

export function StatusBadge({ status, locale }: { status: string; locale: string }) {
  const isRo = locale === "ro"
  const statusMap: Record<string, { label: string; className: string }> = {
    active: {
      label: isRo ? "Activă" : "Active",
      className: "bg-success-soft text-success",
    },
    pending: {
      label: isRo ? "În așteptare" : "Pending",
      className: "bg-warning-soft text-warning",
    },
    cancelled: {
      label: isRo ? "Anulată" : "Cancelled",
      className: "bg-danger-soft text-danger",
    },
    expired: {
      label: isRo ? "Expirată" : "Expired",
      className: "bg-neutral-100 text-neutral-500",
    },
    pending_cancellation: {
      label: isRo ? "Anulare în curs" : "Cancelling",
      className: "bg-warning-soft text-warning",
    },
  }

  const info = statusMap[status] ?? {
    label: status,
    className: "bg-neutral-100 text-neutral-500",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        info.className,
      )}
    >
      {info.label}
    </span>
  )
}
