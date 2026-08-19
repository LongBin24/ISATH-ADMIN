"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useGetAlertRulesQuery } from "@/features/alert/hooks";
import { AlertTable } from "./AlertTable";
import { AlertFilters, type AlertFilterValues } from "./AlertFilters";
import { AlertDetailsDialog } from "./AlertDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";

const defaultFilters: AlertFilterValues = {
  search: "",
  severity: "",
  status: "",
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: typeof BellRing;
  iconClassName: string;
  iconBackground: string;
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBackground,
}: SummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85 min-h-[76px]">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconBackground} ${iconClassName}`}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-black leading-none text-[#003377] dark:text-white">{value}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">{label}</p>
      </div>
    </div>
  );
}

function PageLoading() {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <Skeleton key={item} className="h-20 rounded-2xl" />)}
      </div>
      <Skeleton className="h-32 rounded-3xl" />
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  );
}

export function AlertPage() {
  const { dict, isEnglish } = useI18n();
  const [filters, setFilters] = useState<AlertFilterValues>(defaultFilters);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  const {
    data: alertRules = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAlertRulesQuery();

  const filteredAlertRules = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase();

    return alertRules.filter((rule) => {
      const matchesSearch =
        !search ||
        rule.ruleName.toLocaleLowerCase().includes(search) ||
        rule.alertType.toLocaleLowerCase().includes(search);
      const matchesSeverity = !filters.severity || rule.severity === filters.severity;
      const matchesStatus =
        !filters.status ||
        (filters.status === "enabled" ? rule.enabled : !rule.enabled);

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alertRules, filters]);

  const summary = useMemo(
    () => ({
      total: alertRules.length,
      active: alertRules.filter((rule) => rule.enabled).length,
      warning: alertRules.filter((rule) => rule.severity === "WARNING").length,
      critical: alertRules.filter((rule) => rule.severity === "CRITICAL").length,
    }),
    [alertRules]
  );

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-5 pb-10 font-google-sans">
      <header className="relative overflow-hidden rounded-3xl bg-[#003377] px-5 py-6 text-white shadow-lg shadow-[#003377]/10 sm:px-7 sm:py-7">
        <div aria-hidden="true" className="absolute -right-16 -top-24 size-64 rounded-full bg-[#FFC83D]/20 blur-2xl" />
        <div aria-hidden="true" className="absolute bottom-0 right-32 h-1 w-40 rounded-full bg-[#FFC83D]" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#FFC83D] text-[#003377] shadow-lg shadow-[#FFC83D]/20">
              <BellRing className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{dict.alerts.title}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
                {dict.alerts.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 min-w-[165px] items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-4 text-sm font-bold text-[#003377] shadow-sm transition hover:bg-[#eab52f] disabled:cursor-wait disabled:opacity-70 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? dict.alerts.updating : dict.alerts.updateBtn}</span>
          </button>
        </div>
      </header>

      {isLoading ? (
        <PageLoading />
      ) : isError ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 text-center dark:border-red-900/60 dark:bg-red-950/30">
          <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
            <AlertTriangle className="size-7" />
          </span>
          <h2 className="font-bold text-slate-900 dark:text-white">{dict.alerts.errorLoading}</h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            {dict.alerts.errorDesc}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFC83D] px-5 py-2.5 text-sm font-bold text-[#003377] hover:bg-[#eab52f]"
          >
            <RefreshCw className="size-4" />
            {dict.alerts.tryAgain}
          </button>
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label={dict.alerts.totalRules} value={summary.total} icon={BellRing} iconBackground="bg-[#FFC83D]/20" iconClassName="text-[#8A6500] dark:text-[#FFC83D]" />
            <SummaryCard label={dict.alerts.activeRules} value={summary.active} icon={CheckCircle2} iconBackground="bg-emerald-100 dark:bg-emerald-950/50" iconClassName="text-emerald-600 dark:text-emerald-400" />
            <SummaryCard label={dict.alerts.warningRules} value={summary.warning} icon={AlertTriangle} iconBackground="bg-amber-100 dark:bg-amber-950/50" iconClassName="text-amber-600 dark:text-amber-400" />
            <SummaryCard label={dict.alerts.criticalRules} value={summary.critical} icon={ShieldAlert} iconBackground="bg-red-100 dark:bg-red-950/50" iconClassName="text-red-600 dark:text-red-400" />
          </section>

          <AlertFilters
            filters={filters}
            resultCount={filteredAlertRules.length}
            onFiltersChange={setFilters}
          />
          <AlertTable alertRules={filteredAlertRules} onViewDetails={setSelectedRuleId} />
        </>
      )}

      <AlertDetailsDialog
        isOpen={selectedRuleId !== null}
        onClose={() => setSelectedRuleId(null)}
        ruleId={selectedRuleId}
      />
    </div>
  );
}
