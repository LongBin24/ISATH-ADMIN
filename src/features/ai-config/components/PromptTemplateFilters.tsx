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

  const isTaskTypeSelected = filters.taskType !== "ALL";
  const isScopeSelected = filters.templateScope !== "ALL";
  const isLanguageSelected = filters.languageCode !== "ALL";
  const isStatusSelected = filters.templateStatus !== "ALL";

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("Search by name, key, description, model...")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-10 pr-9 text-xs text-slate-800 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white focus:bg-white focus:border-[#003377] focus:outline-none focus:ring-4 focus:ring-[#003377]/10 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:focus:border-[#FFC83D] dark:focus:bg-slate-900 dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:focus:shadow-[0_0_16px_rgba(255,200,61,0.15)]"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
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
              <SelectTrigger
                className={`h-11 rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 ${
                  isTaskTypeSelected
                    ? "border-[#003377] bg-[#003377]/10 text-[#003377] font-bold [&>svg]:text-[#003377] hover:bg-[#003377]/15 dark:border-[#FFC83D] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D] dark:[&>svg]:text-[#FFC83D] dark:shadow-[0_0_12px_rgba(255,200,61,0.2)] dark:hover:bg-[#FFC83D]/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D]"
                }`}
              >
                <SelectValue
                  placeholder={t("Task Type")}
                  value={
                    filters.taskType === "ALL"
                      ? t("All Tasks")
                      : filters.taskType === "CATEGORY_PREDICTION"
                      ? t("Category Prediction")
                      : filters.taskType === "FINANCIAL_ASSISTANT"
                      ? t("Financial Assistant")
                      : filters.taskType === "SAVINGS_GOAL_ANALYSIS"
                      ? t("Savings Goal Analysis")
                      : filters.taskType === "BUDGET_ADVICE"
                      ? t("Budget Advice")
                      : t(filters.taskType)
                  }
                />
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
              <SelectTrigger
                className={`h-11 rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 ${
                  isScopeSelected
                    ? "border-[#003377] bg-[#003377]/10 text-[#003377] font-bold [&>svg]:text-[#003377] hover:bg-[#003377]/15 dark:border-[#FFC83D] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D] dark:[&>svg]:text-[#FFC83D] dark:shadow-[0_0_12px_rgba(255,200,61,0.2)] dark:hover:bg-[#FFC83D]/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D]"
                }`}
              >
                <SelectValue
                  placeholder={t("Scope")}
                  value={
                    filters.templateScope === "ALL"
                      ? t("All Scopes")
                      : filters.templateScope === "GENERAL_CONVERSATION"
                      ? t("General Conversation")
                      : filters.templateScope === "GENERAL_QUESTION"
                      ? t("General Question")
                      : filters.templateScope === "MONTHLY_SUMMARY"
                      ? t("Monthly Summary")
                      : filters.templateScope === "SAVINGS_ANALYSIS"
                      ? t("Savings Analysis")
                      : filters.templateScope === "SPENDING_ANALYSIS"
                      ? t("Spending Analysis")
                      : filters.templateScope === "INCOME_ANALYSIS"
                      ? t("Income Analysis")
                      : t(filters.templateScope)
                  }
                />
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
              <SelectTrigger
                className={`h-11 rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 ${
                  isLanguageSelected
                    ? "border-[#003377] bg-[#003377]/10 text-[#003377] font-bold [&>svg]:text-[#003377] hover:bg-[#003377]/15 dark:border-[#FFC83D] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D] dark:[&>svg]:text-[#FFC83D] dark:shadow-[0_0_12px_rgba(255,200,61,0.2)] dark:hover:bg-[#FFC83D]/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D]"
                }`}
              >
                <SelectValue
                  placeholder={t("Language")}
                  value={
                    filters.languageCode === "ALL"
                      ? t("All Languages")
                      : filters.languageCode === "km"
                      ? t("Khmer (km)")
                      : t("English (en)")
                  }
                />
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
              <SelectTrigger
                className={`h-11 rounded-2xl text-xs font-semibold shadow-sm transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 ${
                  isStatusSelected
                    ? "border-[#003377] bg-[#003377]/10 text-[#003377] font-bold [&>svg]:text-[#003377] hover:bg-[#003377]/15 dark:border-[#FFC83D] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D] dark:[&>svg]:text-[#FFC83D] dark:shadow-[0_0_12px_rgba(255,200,61,0.2)] dark:hover:bg-[#FFC83D]/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D]"
                }`}
              >
                <SelectValue
                  placeholder={t("Status")}
                  value={
                    filters.templateStatus === "ALL"
                      ? t("All Status")
                      : filters.templateStatus === "ACTIVE"
                      ? t("Active")
                      : filters.templateStatus === "DRAFT"
                      ? t("Draft")
                      : filters.templateStatus === "ARCHIVED"
                      ? t("Archived")
                      : filters.templateStatus === "INACTIVE"
                      ? t("Inactive")
                      : t(filters.templateStatus)
                  }
                />
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
