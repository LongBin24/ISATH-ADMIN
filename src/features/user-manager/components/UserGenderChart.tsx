"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserStatisticsQuery } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

const COLORS = ["#003377", "#FFC83D", "#10B981", "#94A3B8", "#CBD5E1"];

export default function UserGenderChart() {
  const { t } = useAdminI18n();
  const { data: statsRes, isLoading, isError, error } = useGetUserStatisticsQuery();
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
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{t("Gender Distribution")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : isError ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <AlertCircle className="size-6 text-destructive" />
            <p className="text-base text-muted-foreground">{t("Unable to load gender distribution.")}</p>
          </div>
        ) : total === 0 ? (
          <p className="py-16 text-center text-base text-muted-foreground">{t("No gender data available.")}</p>
        ) : (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="h-56 w-full max-w-[220px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rows}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {rows.map((row, index) => (
                      <Cell key={row.key} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${Number(value).toLocaleString()}`, name]}
                    contentStyle={{ borderRadius: 12, fontSize: 14 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full space-y-2.5">
              {rows.map((row, index) => (
                <div key={row.key} className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {row.name}
                  </span>
                  <span className="font-medium text-foreground">
                    {total > 0 ? Math.round((row.value / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
