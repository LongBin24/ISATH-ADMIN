"use client";

import { Search, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PromptTemplateFilterValues {
  search: string;
  taskType: string;
  templateScope: string;
  templateStatus: string;
}

interface PromptTemplateFiltersProps {
  filters: PromptTemplateFilterValues;
  onFilterChange: <K extends keyof PromptTemplateFilterValues>(
    key: K,
    value: PromptTemplateFilterValues[K],
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
    filters.templateStatus !== "ALL",
  );

  const isTaskTypeSelected = filters.taskType !== "ALL";
  const isScopeSelected = filters.templateScope !== "ALL";
  const isStatusSelected = filters.templateStatus !== "ALL";

  return (
    <div className="space-y-3 font-google-sans">
      <div
        className={cn(
          "grid gap-2 md:grid-cols-2 xl:items-center",
          hasActiveFilters
            ? "xl:grid-cols-[minmax(240px,3.5fr)_repeat(4,minmax(130px,1fr))]"
            : "xl:grid-cols-[minmax(280px,4.5fr)_repeat(3,minmax(130px,1fr))]",
        )}
      >
        {/* Search Input Box */}
        <div className="relative md:col-span-2 xl:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder={t("Search Ai model ...")}
            className="h-11 rounded-xl bg-background pl-10 pr-9 text-sm shadow-sm"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Selects */}
        <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 xl:contents">
          {/* Task Type Filter (ប្រភេទកិច្ចការ) */}
          <Select
            value={filters.taskType}
            onValueChange={(val) => onFilterChange("taskType", val)}
          >
            <SelectTrigger
              className={cn(
                "h-11 min-w-[130px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
                isTaskTypeSelected &&
                  "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]",
              )}
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
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">{t("All Tasks")}</SelectItem>
              <SelectItem value="CATEGORY_PREDICTION">
                {t("Category Prediction")}
              </SelectItem>
              <SelectItem value="FINANCIAL_ASSISTANT">
                {t("Financial Assistant")}
              </SelectItem>
              <SelectItem value="SAVINGS_GOAL_ANALYSIS">
                {t("Savings Goal Analysis")}
              </SelectItem>
              <SelectItem value="BUDGET_ADVICE">
                {t("Budget Advice")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Scope Filter (វិសាលភាព) */}
          <Select
            value={filters.templateScope}
            onValueChange={(val) => onFilterChange("templateScope", val)}
          >
            <SelectTrigger
              className={cn(
                "h-11 min-w-[130px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
                isScopeSelected &&
                  "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]",
              )}
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
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">{t("All Scopes")}</SelectItem>
              <SelectItem value="GENERAL_CONVERSATION">
                {t("General Conversation")}
              </SelectItem>
              <SelectItem value="GENERAL_QUESTION">
                {t("General Question")}
              </SelectItem>
              <SelectItem value="MONTHLY_SUMMARY">
                {t("Monthly Summary")}
              </SelectItem>
              <SelectItem value="SAVINGS_ANALYSIS">
                {t("Savings Analysis")}
              </SelectItem>
              <SelectItem value="SPENDING_ANALYSIS">
                {t("Spending Analysis")}
              </SelectItem>
              <SelectItem value="INCOME_ANALYSIS">
                {t("Income Analysis")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter (ស្ថានភាព) */}
          <Select
            value={filters.templateStatus}
            onValueChange={(val) => onFilterChange("templateStatus", val)}
          >
            <SelectTrigger
              className={cn(
                "h-11 min-w-[120px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
                isStatusSelected &&
                  "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]",
              )}
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
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">{t("All Status")}</SelectItem>
              <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
              <SelectItem value="DRAFT">{t("Draft")}</SelectItem>
              <SelectItem value="ARCHIVED">{t("Archived")}</SelectItem>
              <SelectItem value="INACTIVE">{t("Inactive")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="h-11 w-full shrink-0 rounded-xl bg-muted/60 px-3 text-sm font-medium shadow-sm"
              onClick={onReset}
            >
              {t("Reset")}
            </Button>
          )}
        </div>
      </div>

      {resultCount !== undefined && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>
            {t("Found")}{" "}
            <strong className="font-semibold text-foreground">
              {resultCount}
            </strong>{" "}
            {t("prompt templates")}
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
