"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserStatisticsQuery } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

const COLORS = ["#003377", "#FFC83D", "#10B981", "#8B5CF6", "#64748B"];

export default function UserGenderChart() {
  const { t } = useAdminI18n();
  const { data: statsRes, isLoading, isError, error, refetch } = useGetUserStatisticsQuery();
  const gender = statsRes?.gender;

  useEffect(() => {
    if (isError) console.error("[user-manager] GET admin/users/statistics failed", error);
  }, [isError, error]);

  const rows = gender
    ? [
        { key: "male", name: t("Male"), value: gender.male },
        { key: "female", name: t("Female"), value: gender.female },
        { key: "other", name: t("Other"), value: gender.other },
        { key: "preferNotToSay", name: t("Prefer Not To Say"), value: gender.preferNotToSay },
        { key: "unspecified", name: t("Unspecified"), value: gender.unspecified },
      ]
    : [];
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/70 shadow-sm transition-all hover:shadow-md font-google-sans">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]">
              <Users className="size-5" />
            </span>
            <div>
              <CardTitle className="text-lg font-semibold md:text-xl">
                {t("Gender Distribution")}
              </CardTitle>
              <CardDescription>
                {t("Breakdown of users by gender identity.")}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="gap-1.5 border-border/80 bg-muted/50 px-2.5 py-1 text-xs font-semibold text-foreground"
          >
            {total.toLocaleString()} {t("Users")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-xl" />
        ) : isError ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-base font-semibold text-foreground">
              {t("Unable to load gender distribution.")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-1"
            >
              <RefreshCw className="mr-1.5 size-3.5" />
              {t("Retry")}
            </Button>
          </div>
        ) : total === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-base text-muted-foreground">
              {t("No gender data available.")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-56 w-full max-w-[210px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rows}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {rows.map((row, index) => (
                      <Cell key={row.key} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 13,
                      borderColor: "var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("Total Users")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="w-full flex-1 space-y-2">
              {rows.map((row, index) => {
                const percent = total > 0 ? Math.round((row.value / total) * 100) : 0;
                return (
                  <div
                    key={row.key}
                    className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate text-sm font-medium text-foreground">
                        {row.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold text-foreground">
                        {row.value.toLocaleString()}
                      </span>
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
