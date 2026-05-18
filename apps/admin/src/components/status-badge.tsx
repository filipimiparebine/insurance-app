import { cn } from "@/lib/utils";

type StatusVariant = "active" | "pending" | "cancelled" | "pending_cancellation" | "success" | "danger" | "warning" | "info" | "default";

const variantMap: Record<StatusVariant, string> = {
  active: "bg-success-soft text-success",
  pending: "bg-warning-soft text-warning",
  cancelled: "bg-neutral-100 text-text-secondary",
  pending_cancellation: "bg-brand-accent-soft text-brand-accent",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
  warning: "bg-warning-soft text-warning",
  info: "bg-electric-soft text-electric",
  default: "bg-neutral-100 text-text-secondary",
};

const labelMap: Record<string, string> = {
  active: "Activa", pending: "In asteptare", cancelled: "Anulata",
  pending_cancellation: "Anulare in curs", success: "Succes", danger: "Eroare", warning: "Atentie", info: "Info",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = (status in variantMap ? status : "default") as StatusVariant;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variantMap[variant], className)}>
      {labelMap[status] ?? status}
    </span>
  );
}
