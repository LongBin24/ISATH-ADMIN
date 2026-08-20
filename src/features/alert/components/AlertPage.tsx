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
    <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/85">
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconBackground} ${iconClassName}`}>
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-2xl font-black leading-none text-[#003377] dark:text-white">{value}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
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
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">គ្រប់គ្រងការជូនដំណឹង</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
                តាមដាន និងពិនិត្យការរំឭកស្វ័យប្រវត្តិរបស់ប្រព័ន្ធទាំងអស់។
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#FFC83D] px-4 text-sm font-bold text-[#003377] shadow-sm transition hover:bg-[#eab52f] disabled:cursor-wait disabled:opacity-70"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "កំពុងធ្វើបច្ចុប្បន្នភាព..." : "ធ្វើបច្ចុប្បន្នភាព"}
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
          <h2 className="font-bold text-slate-900 dark:text-white">មិនអាចទាញយការរំឭកបានទេ</h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនមេ។ សូមពិនិត្យការតភ្ជាប់ ហើយព្យាយាមម្តងទៀត។
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FFC83D] px-5 py-2.5 text-sm font-bold text-[#003377] hover:bg-[#eab52f]"
          >
            <RefreshCw className="size-4" />
            ព្យាយាមម្តងទៀត
          </button>
        </div>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="ច្បាប់សរុប" value={summary.total} icon={BellRing} iconBackground="bg-[#FFC83D]/20" iconClassName="text-[#8A6500] dark:text-[#FFC83D]" />
            <SummaryCard label="កំពុងដំណើរការ" value={summary.active} icon={CheckCircle2} iconBackground="bg-emerald-100 dark:bg-emerald-950/50" iconClassName="text-emerald-600 dark:text-emerald-400" />
            <SummaryCard label="ត្រូវប្រុងប្រយ័ត្ន" value={summary.warning} icon={AlertTriangle} iconBackground="bg-amber-100 dark:bg-amber-950/50" iconClassName="text-amber-600 dark:text-amber-400" />
            <SummaryCard label="ធ្ងន់ធ្ងរ" value={summary.critical} icon={ShieldAlert} iconBackground="bg-red-100 dark:bg-red-950/50" iconClassName="text-red-600 dark:text-red-400" />
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
