"use client";

import { Search, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface PromptTemplateFilterValues {
  search: string;
  taskType: string;
  templateScope: string;
  languageCode: string;
  templateStatus: string;
}

interface PromptTemplateFiltersProps {
  filters: PromptTemplateFilterValues;
  onFilterChange: <K extends keyof PromptTemplateFilterValues>(
    key: K,
    value: PromptTemplateFilterValues[K]
  ) => void;
  onReset: () => void;
  resultCount?: number;
}

export function PromptTemplateFilters({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}: PromptTemplateFiltersProps) {
  const { t } = useAdminI18n();

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.taskType !== "ALL" ||
      filters.templateScope !== "ALL" ||
      filters.languageCode !== "ALL" ||
      filters.templateStatus !== "ALL"
  );

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="group relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-hover:text-[#003377] group-focus-within:text-[#003377] dark:text-slate-400 dark:group-hover:text-[#FFC83D] dark:group-focus-within:text-[#FFC83D]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("Search by template name, key, or description...")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all duration-200 hover:border-[#FFC83D]/60 hover:bg-slate-100/90 focus:border-[#003377] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#003377]/10 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:hover:border-[#FFC83D]/50 dark:hover:bg-slate-800/80 dark:focus:border-[#FFC83D] dark:focus:bg-slate-950 dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:focus:shadow-[0_0_15px_rgba(255,200,61,0.15)]"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition-all duration-150 hover:bg-slate-200 hover:text-[#003377] active:scale-90 active:bg-[#FFC83D] active:text-[#003377] dark:hover:bg-slate-700 dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Selects */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Task Type Filter (ប្រភេទកិច្ចការ) */}
          <div className="w-[175px]">
            <Select
              value={filters.taskType}
              onValueChange={(val) => onFilterChange("taskType", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:hover:shadow-[0_0_12px_rgba(255,200,61,0.15)] dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                <SelectValue placeholder={t("Task Type")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Tasks")}</SelectItem>
                <SelectItem value="CATEGORY_PREDICTION">{t("Category Prediction")}</SelectItem>
                <SelectItem value="FINANCIAL_ASSISTANT">{t("Financial Assistant")}</SelectItem>
                <SelectItem value="SAVINGS_GOAL_ANALYSIS">{t("Savings Goal Analysis")}</SelectItem>
                <SelectItem value="BUDGET_ADVICE">{t("Budget Advice")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Filter (វិសាលភាព) */}
          <div className="w-[190px]">
            <Select
              value={filters.templateScope}
              onValueChange={(val) => onFilterChange("templateScope", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:hover:shadow-[0_0_12px_rgba(255,200,61,0.15)] dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                <SelectValue placeholder={t("Scope")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Scopes")}</SelectItem>
                <SelectItem value="GENERAL_CONVERSATION">{t("General Conversation")}</SelectItem>
                <SelectItem value="GENERAL_QUESTION">{t("General Question")}</SelectItem>
                <SelectItem value="MONTHLY_SUMMARY">{t("Monthly Summary")}</SelectItem>
                <SelectItem value="SAVINGS_ANALYSIS">{t("Savings Analysis")}</SelectItem>
                <SelectItem value="SPENDING_ANALYSIS">{t("Spending Analysis")}</SelectItem>
                <SelectItem value="INCOME_ANALYSIS">{t("Income Analysis")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter (ភាសា) */}
          <div className="w-[140px]">
            <Select
              value={filters.languageCode}
              onValueChange={(val) => onFilterChange("languageCode", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:hover:shadow-[0_0_12px_rgba(255,200,61,0.15)] dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                <SelectValue placeholder={t("Language")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Languages")}</SelectItem>
                <SelectItem value="km">{t("Khmer (km)")}</SelectItem>
                <SelectItem value="en">{t("English (en)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter (ស្ថានភាព) */}
          <div className="w-[140px]">
            <Select
              value={filters.templateStatus}
              onValueChange={(val) => onFilterChange("templateStatus", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:hover:shadow-[0_0_12px_rgba(255,200,61,0.15)] dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                <SelectValue placeholder={t("Status")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Status")}</SelectItem>
                <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
                <SelectItem value="DRAFT">{t("Draft")}</SelectItem>
                <SelectItem value="ARCHIVED">{t("Archived")}</SelectItem>
                <SelectItem value="INACTIVE">{t("Inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-11 items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-200 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
            >
              <X className="h-3.5 w-3.5" />
              {t("Reset")}
            </button>
          )}
        </div>
      </div>

      {resultCount !== undefined && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>
            {t("Found")} <strong className="text-slate-800 dark:text-slate-200">{resultCount}</strong> {t("prompt templates")}
          </span>
          {hasActiveFilters && (
            <span className="font-medium text-[#003377] dark:text-[#FFC83D]">
              {t("Filters applied")}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
