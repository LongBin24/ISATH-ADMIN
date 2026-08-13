"use client";

import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

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
  "h-11 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition hover:border-[#FFC83D] focus:border-[#FFC83D] focus:ring-4 focus:ring-[#FFC83D]/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

export function AlertFilters({
  filters,
  resultCount,
  onFiltersChange,
}: AlertFiltersProps) {
  const hasFilters = Boolean(filters.search || filters.severity || filters.status);

  const resetFilters = () => {
    onFiltersChange({ search: "", severity: "", status: "" });
  };

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-[#FFC83D]/20 text-[#8A6500] dark:text-[#FFC83D]">
            <SlidersHorizontal className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">ស្វែងរក និងតម្រង</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">រកឃើញ {resultCount} ច្បាប់</p>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
          >
            <RotateCcw className="size-3.5" />
            សម្អាតតម្រង
          </button>
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_220px_220px]">
        <label className="relative block">
          <span className="sr-only">ស្វែងរកតាមឈ្មោះច្បាប់</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              onFiltersChange({ ...filters, search: event.target.value })
            }
            placeholder="ស្វែងរកតាមឈ្មោះច្បាប់..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-[#FFC83D] focus:border-[#FFC83D] focus:bg-white focus:ring-4 focus:ring-[#FFC83D]/15 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFiltersChange({ ...filters, search: "" })}
              aria-label="សម្អាតការស្វែងរក"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
            >
              <X className="size-3.5" />
            </button>
          )}
        </label>

        <label className="relative">
          <span className="sr-only">តម្រងតាមកម្រិត</span>
          <select
            value={filters.severity}
            onChange={(event) =>
              onFiltersChange({ ...filters, severity: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">កម្រិតទាំងអស់</option>
            <option value="INFO">ព័ត៌មាន</option>
            <option value="WARNING">ប្រុងប្រយ័ត្ន</option>
            <option value="CRITICAL">ធ្ងន់ធ្ងរ</option>
          </select>
        </label>

        <label className="relative">
          <span className="sr-only">តម្រងតាមស្ថានភាព</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({ ...filters, status: event.target.value })
            }
            className={selectClassName}
          >
            <option value="">ស្ថានភាពទាំងអស់</option>
            <option value="enabled">កំពុងដំណើរការ</option>
            <option value="disabled">បានបិទ</option>
          </select>
        </label>
      </div>
    </section>
  );
}
