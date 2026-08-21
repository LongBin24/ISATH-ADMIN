"use client";

import { useEffect } from "react";
import { AlertCircle, BarChart3, RefreshCw } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserStatisticsQuery } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

const AGE_COLORS = [
  "#003377",
  "#0EA5E9",
  "#10B981",
  "#FEDB55",
  "#F59E0B",
  "#8B5CF6",
  "#64748B",
];

export default function UserAgeChart() {
  const { t } = useAdminI18n();
  const {
    data: statsRes,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserStatisticsQuery();
  const ageGroups = statsRes?.ageGroups;

  useEffect(() => {
    if (isError)
      console.error("[user-manager] GET admin/users/statistics failed", error);
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
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/70 shadow-sm transition-all hover:shadow-md font-google-sans">
      <CardHeader className="border-b border-border/60 bg-muted/20 pb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]">
              <BarChart3 className="size-5" />
            </span>
            <div>
              <CardTitle className="text-lg font-semibold md:text-xl">
                {t("Age Distribution")}
              </CardTitle>
              <CardDescription>
                {t("Breakdown of users across age groups.")}
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
              {t("Unable to load age distribution.")}
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
              {t("No age data available.")}
            </p>
          </div>
        ) : (
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-border/60"
                />
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
                  width={32}
                />
                <ChartTooltip
                  formatter={(value, name) => [
                    `${Number(value).toLocaleString()} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                    name,
                  ]}
                  cursor={{ fill: "var(--accent)", opacity: 0.2 }}
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 13,
                    borderColor: "var(--border)",
                    backgroundColor: "var(--card)",
                    color: "var(--foreground)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {rows.map((row, index) => (
                    <Cell
                      key={row.name}
                      fill={AGE_COLORS[index % AGE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
