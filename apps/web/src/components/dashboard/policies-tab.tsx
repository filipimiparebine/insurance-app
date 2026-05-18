"use client"

import { useState } from "react"
import { Card, CardContent } from "@blaj/ui"
import { Button } from "@blaj/ui"
import { Separator } from "@blaj/ui"
import { Calendar, Shield, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { CancellationWizard } from "./cancellation-wizard"

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
  withdrawalUntil?: string
  details?: {
    bonusMalusClass?: string
    directSettlement?: boolean
    vehicleId?: string
  }
}

type FilterStatus = "all" | "active" | "expired" | "cancelled"

export function PoliciesTab({
  locale,
  profileData,
}: {
  locale: string
  profileData: Record<string, unknown> | null
}) {
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  const policies = (profileData?.policies as PolicyItem[] | undefined) ?? []
  const isRo = locale === "ro"

  const filterLabels: Record<FilterStatus, string> = {
    all: isRo ? "Toate" : "All",
    active: isRo ? "Active" : "Active",
    expired: isRo ? "Expirate" : "Expired",
    cancelled: isRo ? "Anulate" : "Cancelled",
  }

  const filteredPolicies =
    filter === "all" ? policies : policies.filter((p) => p.status === filter)

  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Shield className="h-12 w-12 text-neutral-300 mb-3" />
        <h3 className="text-lg font-semibold text-neutral-700 font-display">
          {isRo ? "Nu ai polițe încă" : "No policies yet"}
        </h3>
        <p className="mt-1 text-sm text-neutral-500 max-w-sm">
          {isRo
            ? "Achiziționează prima poliță RCA și gestioneaz-o de aici."
            : "Get your first RCA policy and manage it here."}
        </p>
        <Button variant="primary" size="md" className="mt-4" asChild>
          <a href={`/${locale}/asigurare`}>
            {isRo ? "Calculează prețul →" : "Calculate price →"}
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 font-display">
          {isRo ? "Polițele mele" : "My policies"}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {policies.length} {isRo ? "polițe" : "policies"}
        </p>
      </div>

      <div className="flex gap-2">
        {(Object.keys(filterLabels) as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === f
                ? "bg-brand-primary text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200",
            )}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredPolicies.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-neutral-900">
                      {p.policyType?.toUpperCase() ?? "RCA"}
                    </span>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      p.status === "active"
                        ? "bg-success-soft text-success"
                        : p.status === "expired"
                          ? "bg-neutral-100 text-neutral-500"
                          : p.status === "cancelled"
                            ? "bg-danger-soft text-danger"
                            : "bg-warning-soft text-warning",
                    )}>
                      {p.status === "active"
                        ? isRo ? "Activă" : "Active"
                        : p.status === "expired"
                          ? isRo ? "Expirată" : "Expired"
                          : p.status === "cancelled"
                            ? isRo ? "Anulată" : "Cancelled"
                            : p.status ?? "—"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {p.policyNumber ?? "—"} &middot; {p.insurerCode ?? "—"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">
                      {p.premiumAmount
                        ? new Intl.NumberFormat(isRo ? "ro-RO" : "en-US", {
                            minimumFractionDigits: 2,
                          }).format(parseFloat(p.premiumAmount))
                        : "—"}{" "}
                      RON
                    </p>
                    <p className="text-xs text-neutral-500">
                      {p.startDate
                        ? new Date(p.startDate).toLocaleDateString(isRo ? "ro-RO" : "en-US", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}{" "}
                      —{" "}
                      {p.endDate
                        ? new Date(p.endDate).toLocaleDateString(isRo ? "ro-RO" : "en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {p.status === "active" && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3 p-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {p.withdrawalUntil
                        ? isRo
                          ? `Retragere până la ${new Date(p.withdrawalUntil).toLocaleDateString("ro-RO")}`
                          : `Withdrawal until ${new Date(p.withdrawalUntil).toLocaleDateString("en-US")}`
                        : null}
                    </div>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 h-8 text-xs"
                      onClick={() => setCancellingId(p.id ?? null)}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {isRo ? "Anulează" : "Cancel"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredPolicies.length === 0 && (
          <p className="text-center text-sm text-neutral-400 py-8">
            {isRo ? "Nicio poliță cu acest status." : "No policies with this status."}
          </p>
        )}
      </div>

      {cancellingId && (
        <CancellationWizard
          locale={locale}
          policyId={cancellingId}
          onClose={() => setCancellingId(null)}
        />
      )}
    </div>
  )
}
