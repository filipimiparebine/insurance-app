"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/stat-card";
import { FileText, Users, AlertTriangle, TrendingUp, XCircle, DollarSign, Activity } from "lucide-react";
import { orpc } from "@/lib/orpc-client";
import { Card, CardContent, CardHeader, CardTitle } from "@blaj/ui";
import { cn } from "@/lib/utils";

interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  policiesThisWeek: number;
  policiesThisMonth: number;
  totalUsers: number;
  newUsersThisMonth: number;
  totalRevenueRON: number;
  mrrRON: number;
  pendingCancellations: number;
  baarLeads: number;
  conversionRate: number;
}

const MOCK_STATS: DashboardStats = {
  totalPolicies: 150,
  activePolicies: 120,
  policiesThisWeek: 8,
  policiesThisMonth: 34,
  totalUsers: 89,
  newUsersThisMonth: 12,
  totalRevenueRON: 45600,
  mrrRON: 12400,
  pendingCancellations: 3,
  baarLeads: 7,
  conversionRate: 68,
};

const TRENDS: Partial<Record<keyof DashboardStats, { value: string; positive: boolean }>> = {
  policiesThisMonth: { value: "12% vs luna trecută", positive: true },
  newUsersThisMonth: { value: "8% vs luna trecută", positive: true },
  mrrRON: { value: "5% vs luna trecută", positive: true },
  pendingCancellations: { value: "2 mai mult decât luna trecută", positive: false },
  conversionRate: { value: "3% față de lună trecută", positive: true },
};

export function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    orpc.admin.stats.dashboard({})
      .then((data: unknown) => setStats(data as DashboardStats))
      .catch((err: Error) => {
        setError(err.message);
        setStats(MOCK_STATS);
      });
  }, []);

  const s = stats ?? MOCK_STATS;
  const loading = stats === null && !error;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Dashboard</h1>
        <p className="mt-1 text-sm text-text-secondary">Prezentare generală a activității</p>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 text-sm text-danger flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Serverul oRPC nu răspunde. Se afișează date demonstrative.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <StatCard label="Polițe active" value={loading ? "—" : s.activePolicies} icon={<FileText className="h-5 w-5 text-brand-accent" />} trend={TRENDS.policiesThisMonth} />
        <StatCard label="Polițe (săptămâna)" value={loading ? "—" : s.policiesThisWeek} icon={<Activity className="h-5 w-5 text-electric" />} />
        <StatCard label="Utilizatori" value={loading ? "—" : s.totalUsers} icon={<Users className="h-5 w-5 text-electric" />} trend={TRENDS.newUsersThisMonth} />
        <StatCard label="MRR" value={loading ? "—" : `${s.mrrRON.toLocaleString("ro-RO")} RON`} icon={<DollarSign className="h-5 w-5 text-success" />} trend={TRENDS.mrrRON} />
        <StatCard label="BAAR Leads" value={loading ? "—" : s.baarLeads} icon={<AlertTriangle className="h-5 w-5 text-warning" />} />
        <StatCard label="Anulări în așteptare" value={loading ? "—" : s.pendingCancellations} icon={<XCircle className="h-5 w-5 text-danger" />} trend={TRENDS.pendingCancellations} />
        <StatCard label="Rata conversie" value={loading ? "—" : `${s.conversionRate}%`} icon={<TrendingUp className="h-5 w-5 text-success" />} trend={TRENDS.conversionRate} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pâlnie conversie (luna aceasta)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Vizitatori unici", value: s.totalUsers * 15, pct: 100, color: "bg-neutral-200" },
              { label: "Oferte generate", value: s.policiesThisMonth * 4, pct: 68, color: "bg-electric" },
              { label: "Polițe emise", value: s.policiesThisMonth, pct: 25, color: "bg-brand-accent" },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-text-primary">{step.label}</span>
                  <span className="text-text-secondary">{step.value.toLocaleString("ro-RO")}</span>
                </div>
                <div className="h-5 overflow-hidden rounded-full bg-neutral-100 relative">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", step.color)}
                    style={{ width: `${step.pct}%` }}
                  />
                  {step.pct < 100 && (
                    <span className="absolute inset-0 flex items-center justify-end pr-3 text-[11px] font-medium text-text-secondary">
                      {step.pct}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
