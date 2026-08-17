"use client";

import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";

export interface AlertFilterValues {
  search: string;
  severity: string;
  status: string;
}

interface AlertFiltersProps {
  filters: AlertFilterValues;
  resultCount: number;
  onFiltersChange: (filters: AlertFilterValues) => void;
}

const selectClassName =
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 text-base font-semibold text-slate-700 outline-none transition hover:border-[#FFC83D] focus:border-[#FFC83D] focus:ring-4 focus:ring-[#FFC83D]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

export function AlertFilters({
  filters,
  resultCount,
  onFiltersChange,
}: AlertFiltersProps) {
  const { t } = useAdminI18n();
  const hasFilters = Boolean(filters.search || filters.severity || filters.status);

  const resetFilters = () => {
    onFiltersChange({ search: "", severity: "", status: "" });
  };

  return (
    <section className="filter-card rounded-3xl border border-slate-200/80 bg-white p-4 text-base shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFC83D]/20 text-[#8A6500] dark:text-[#FFC83D]">
            <SlidersHorizontal className="size-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{t("Search and Filters")}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("Found")} {resultCount} {t("Alert Rules")}</p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-base font-bold text-slate-500 transition hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
          >
            <RotateCcw className="size-3.5" />
            {t("Reset Filters")}
          </button>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_220px]">
        <label className="relative block">
          <span className="sr-only">{t("Search by rule name...")}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange({ ...filters, search: event.target.value })
            }
            placeholder={t("Search by rule name...")}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-base text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-[#FFC83D] focus:border-[#FFC83D] focus:bg-white focus:ring-4 focus:ring-[#FFC83D]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              aria-label={t("Clear search")}
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>

        <label className="relative">
          <span className="sr-only">{t("Filter by severity")}</span>
          <select
            value={filters.severity}
            onChange={(event) =>
              onFiltersChange({ ...filters, severity: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">{t("All Severities")}</option>
            <option value="INFO">{t("Info")}</option>
            <option value="WARNING">{t("Warning")}</option>
            <option value="CRITICAL">{t("Critical")}</option>
          </select>
        </label>

        <label className="relative">
          <span className="sr-only">{t("Filter by status")}</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({ ...filters, status: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">{t("All Statuses")}</option>
            <option value="enabled">{t("Enabled")}</option>
            <option value="disabled">{t("Disabled")}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
