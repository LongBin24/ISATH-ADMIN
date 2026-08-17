"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserStatisticsQuery } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

const AGE_COLORS = ["#003377", "#0EA5E9", "#10B981", "#FEDB55", "#F59E0B", "#8B5CF6", "#64748B"];

export default function UserAgeChart() {
  const { t } = useAdminI18n();
  const { data: statsRes, isLoading, isError, error } = useGetUserStatisticsQuery();
  const ageGroups = statsRes?.ageGroups;

  useEffect(() => {
    if (isError) console.error("[user-manager] GET admin/users/statistics failed", error);
  }, [isError, error]);

  const rows = ageGroups
    ? [
        { name: t("Under 15"), value: ageGroups.under15 },
        { name: "15–24", value: ageGroups.age15To24 },
        { name: "25–44", value: ageGroups.age25To44 },
        { name: "45–59", value: ageGroups.age45To59 },
        { name: "60–74", value: ageGroups.age60To74 },
        { name: "75+", value: ageGroups.age75Plus },
        { name: t("Unknown"), value: ageGroups.unknown },
      ]
    : [];
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{t("Age Distribution")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <AlertCircle className="size-6 text-destructive" />
            <p className="text-base text-muted-foreground">{t("Unable to load age distribution.")}</p>
          </div>
        ) : total === 0 ? (
          <p className="py-16 text-center text-base text-muted-foreground">{t("No age data available.")}</p>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                />
                <Tooltip
                  cursor={{ fill: "var(--accent)" }}
                  contentStyle={{ borderRadius: 12, fontSize: 14 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {rows.map((row, index) => <Cell key={row.name} fill={AGE_COLORS[index % AGE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
