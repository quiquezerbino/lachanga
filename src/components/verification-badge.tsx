import { ShieldCheck, ShieldAlert, Clock, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

const config: Record<VerificationStatus, { icon: typeof ShieldCheck; label: string; className: string }> = {
  unverified: { icon: ShieldAlert, label: "Sin verificar", className: "text-muted-foreground" },
  pending: { icon: Clock, label: "En revisión", className: "text-amber-500" },
  verified: { icon: ShieldCheck, label: "Verificado", className: "text-accent" },
  rejected: { icon: ShieldX, label: "Rechazado", className: "text-destructive" },
};

interface VerificationBadgeProps {
  status: VerificationStatus;
  showLabel?: boolean;
  className?: string;
}

export function VerificationBadge({ status, showLabel = false, className }: VerificationBadgeProps) {
  const { icon: Icon, label, className: colorClass } = config[status] || config.unverified;

  return (
    <span className={cn("inline-flex items-center gap-1", colorClass, className)} title={label}>
      <Icon className="h-4 w-4" />
      {showLabel && <span className="text-xs font-medium">{label}</span>}
    </span>
  );
}
