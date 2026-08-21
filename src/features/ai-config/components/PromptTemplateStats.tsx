"use client";

import { Sparkles, CheckCircle2, Globe, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { PromptTemplateItem } from "../types";

interface PromptTemplateStatsProps {
  templates: PromptTemplateItem[];
  totalElements?: number;
  isLoading?: boolean;
}

export function PromptTemplateStats({
  templates,
  totalElements,
  isLoading,
}: PromptTemplateStatsProps) {
  const { t } = useAdminI18n();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
    );
  }

  const total = totalElements ?? templates.length;
  const activeCount = templates.filter((t) => t.templateStatus === "ACTIVE").length;
  const khmerCount = templates.filter((t) => t.languageCode === "km").length;
  const englishCount = templates.filter((t) => t.languageCode === "en").length;

  const stats = [
    {
      label: t("Total Templates"),
      value: total,
      subtext: t("Registered prompts"),
      icon: Sparkles,
      bg: "bg-[#FFC83D]/15 text-[#003377] dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]",
      badge: `${templates.length} ${t("loaded")}`,
    },
    {
      label: t("Active Status"),
      value: activeCount,
      subtext: t("In production"),
      icon: CheckCircle2,
      bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
      badge: total > 0 ? `${Math.round((activeCount / (templates.length || 1)) * 100)}%` : "0%",
    },
    {
      label: t("Khmer Prompts (km)"),
      value: khmerCount,
      subtext: t("Localized templates"),
      icon: Globe,
      bg: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      badge: "km",
    },
    {
      label: t("English Prompts (en)"),
      value: englishCount,
      subtext: t("Standard templates"),
      icon: Layers,
      bg: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
      badge: "en",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group relative flex items-center justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#FFC83D]/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/60"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p
                className="stat-card-value card-number text-[30px] text-3xl font-bold tracking-tight text-[#003377] dark:text-white"
                style={{ fontSize: "30px", lineHeight: "36px" }}
              >
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stat.subtext}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg} shadow-sm`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
