"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AccountStatus } from "@/features/user-manager/types";
import { useAdminI18n } from "@/i18n/admin-i18n";

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  const { t } = useAdminI18n();
  const normalized = status.toUpperCase();
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    SUSPENDED: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    DELETED: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  const label: Record<string, string> = {
    ACTIVE: "Active",
    SUSPENDED: "Suspended",
    DELETED: "Deleted",
  };

  return (
    <Badge className={cn("border-transparent text-sm font-medium", styles[normalized] ?? styles.DELETED)}>
      {t(label[normalized] ?? normalized)}
    </Badge>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  const { t } = useAdminI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        verified ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
      )}
    >
      {verified ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
      {t(verified ? "Verified" : "Not Verified")}
    </span>
  );
}

export function OnboardingBadge({ completed }: { completed: boolean }) {
  const { t } = useAdminI18n();
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-sm font-medium",
        completed
          ? "border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-300"
          : "border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-300"
      )}
    >
      {t(completed ? "Completed" : "Pending")}
    </Badge>
  );
}
