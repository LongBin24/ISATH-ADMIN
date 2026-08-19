"use client";

import { useEffect } from "react";
import { AlertCircle, Users, UserCheck, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAdminUsersQuery,
  useGetUserStatisticsQuery,
} from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | null;
  helperText: string;
  iconClassName: string;
  isLoading: boolean;
  isError: boolean;
}

function StatCard({ icon: Icon, label, value, helperText, iconClassName, isLoading, isError }: StatCardProps) {
  const { t } = useAdminI18n();
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="flex flex-col gap-3 p-6">
        <div className={`flex size-11 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon className="size-5" />
        </div>
        <div>
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : isError ? (
            <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
              <AlertCircle className="size-4" />
              {t("Failed to load")}
            </p>
          ) : (
            <p className="text-3xl font-semibold text-foreground">
              {value !== null ? value.toLocaleString() : "—"}
            </p>
          )}
          <p className="mt-1 text-sm font-medium text-foreground">{t(label)}</p>
          <p className="text-sm text-muted-foreground">{t(helperText)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserStatCards() {
  const statsQuery = useGetUserStatisticsQuery();
  const activeQuery = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 1, accountStatus: "ACTIVE" });
  const suspendedQuery = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 1, accountStatus: "SUSPENDED" });
  const onboardedQuery = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 1, onboardingCompleted: true });

  useEffect(() => {
    if (statsQuery.isError) console.error("[user-manager] GET admin/users/statistics failed", statsQuery.error);
    if (activeQuery.isError) console.error("[user-manager] GET admin/users?accountStatus=ACTIVE failed", activeQuery.error);
    if (suspendedQuery.isError) console.error("[user-manager] GET admin/users?accountStatus=SUSPENDED failed", suspendedQuery.error);
    if (onboardedQuery.isError) console.error("[user-manager] GET admin/users?onboardingCompleted=true failed", onboardedQuery.error);
  }, [statsQuery.isError, statsQuery.error, activeQuery.isError, activeQuery.error, suspendedQuery.isError, suspendedQuery.error, onboardedQuery.isError, onboardedQuery.error]);

  return (
    <div className="admin-stat-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label="Total Users"
        value={statsQuery.data?.totalUsers ?? null}
        helperText="Registered accounts"
        iconClassName="bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]"
        isLoading={statsQuery.isLoading}
        isError={statsQuery.isError}
      />
      <StatCard
        icon={UserCheck}
        label="Active"
        value={activeQuery.data?.totalElements ?? null}
        helperText="Currently active accounts"
        iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        isLoading={activeQuery.isLoading}
        isError={activeQuery.isError}
      />
      <StatCard
        icon={ShieldAlert}
        label="Suspended"
        value={suspendedQuery.data?.totalElements ?? null}
        helperText="Accounts pending review"
        iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        isLoading={suspendedQuery.isLoading}
        isError={suspendedQuery.isError}
      />
      <StatCard
        icon={CheckCircle2}
        label="Onboarded"
        value={onboardedQuery.data?.totalElements ?? null}
        helperText="Completed onboarding"
        iconClassName="bg-[#FFC83D]/20 text-[#003377] dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]"
        isLoading={onboardedQuery.isLoading}
        isError={onboardedQuery.isError}
      />
    </div>
  );
}
