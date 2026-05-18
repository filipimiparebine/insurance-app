import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-3xl font-display font-semibold text-brand-primary mt-2">{value}</p>
          {trend && (
            <p className={cn("text-xs mt-1", trend.positive ? "text-success" : "text-danger")}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-brand-accent-soft flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
