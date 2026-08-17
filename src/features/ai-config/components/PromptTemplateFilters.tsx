"use client";

import { Search, X, Filter } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskType, TemplateScope, LanguageCode, PromptTemplateStatus } from "../types";

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
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("Search by template name, key, or description...")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-[#FFC83D]"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Selects */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Task Type Filter */}
          <div className="w-[175px]">
            <Select
              value={filters.taskType}
              onValueChange={(val) => onFilterChange("taskType", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-800">
                <SelectValue placeholder={t("Task Type")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Tasks")}</SelectItem>
                <SelectItem value="CATEGORY_PREDICTION">Category Prediction</SelectItem>
                <SelectItem value="FINANCIAL_ASSISTANT">Financial Assistant</SelectItem>
                <SelectItem value="SAVINGS_GOAL_ANALYSIS">Savings Goal Analysis</SelectItem>
                <SelectItem value="BUDGET_ADVICE">Budget Advice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scope Filter */}
          <div className="w-[190px]">
            <Select
              value={filters.templateScope}
              onValueChange={(val) => onFilterChange("templateScope", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-800">
                <SelectValue placeholder={t("Scope")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Scopes")}</SelectItem>
                <SelectItem value="GENERAL_CONVERSATION">General Conversation</SelectItem>
                <SelectItem value="GENERAL_QUESTION">General Question</SelectItem>
                <SelectItem value="MONTHLY_SUMMARY">Monthly Summary</SelectItem>
                <SelectItem value="SAVINGS_ANALYSIS">Savings Analysis</SelectItem>
                <SelectItem value="SPENDING_ANALYSIS">Spending Analysis</SelectItem>
                <SelectItem value="INCOME_ANALYSIS">Income Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Filter */}
          <div className="w-[140px]">
            <Select
              value={filters.languageCode}
              onValueChange={(val) => onFilterChange("languageCode", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-800">
                <SelectValue placeholder={t("Language")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="ALL">{t("All Languages")}</SelectItem>
                <SelectItem value="km">🇰🇭 Khmer (km)</SelectItem>
                <SelectItem value="en">🇬🇧 English (en)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-[140px]">
            <Select
              value={filters.templateStatus}
              onValueChange={(val) => onFilterChange("templateStatus", val)}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-800">
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
              className="inline-flex h-11 items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
