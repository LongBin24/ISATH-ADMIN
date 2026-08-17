"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAdminPromptTemplatesQuery } from "../api";
import type { PromptTemplateItem, PromptTemplateQueryParams } from "../types";

import { PromptTemplateStats } from "./PromptTemplateStats";
import { PromptTemplateFilters, type PromptTemplateFilterValues } from "./PromptTemplateFilters";
import { PromptTemplateTable } from "./PromptTemplateTable";
import { PromptTemplateDetailsDialog } from "./PromptTemplateDetailsDialog";
import { PromptTemplateTestDialog } from "./PromptTemplateTestDialog";
import { PromptTemplateVersionHistoryDialog } from "./PromptTemplateVersionHistoryDialog";
import { PromptTemplateCreateDialog } from "./PromptTemplateCreateDialog";

const defaultFilters: PromptTemplateFilterValues = {
  search: "",
  taskType: "ALL",
  templateScope: "ALL",
  languageCode: "ALL",
  templateStatus: "ALL",
};

export function PromptTemplateManager() {
  const { t } = useAdminI18n();

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<PromptTemplateFilterValues>(defaultFilters);

  // Dialog state
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplateItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<PromptTemplateItem | null>(null);

  // Build query params
  const queryParams = useMemo<PromptTemplateQueryParams>(() => {
    const params: PromptTemplateQueryParams = {
      pageNumber,
      pageSize,
      sortBy: "createdAt",
      sortDirection: "DESC",
    };

    if (filters.search) params.search = filters.search;
    if (filters.taskType !== "ALL") params.taskType = filters.taskType;
    if (filters.templateScope !== "ALL") params.templateScope = filters.templateScope;
    if (filters.languageCode !== "ALL") params.languageCode = filters.languageCode;
    if (filters.templateStatus !== "ALL") params.templateStatus = filters.templateStatus;

    return params;
  }, [filters, pageNumber, pageSize]);

  const {
    data: pageData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdminPromptTemplatesQuery(queryParams);

  const templates = pageData?.content || [];
  const totalElements = pageData?.totalElements ?? templates.length;
  const totalPages = pageData?.totalPages ?? 1;

  function handleFilterChange<K extends keyof PromptTemplateFilterValues>(
    key: K,
    val: PromptTemplateFilterValues[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPageNumber(0);
  }

  function handleResetFilters() {
    setFilters(defaultFilters);
    setPageNumber(0);
  }

  function openDetails(template: PromptTemplateItem) {
    setSelectedTemplate(template);
    setDetailsOpen(true);
  }

  function openTest(template: PromptTemplateItem) {
    setSelectedTemplate(template);
    setTestOpen(true);
  }

  function openHistory(template: PromptTemplateItem) {
    setSelectedTemplate(template);
    setHistoryOpen(true);
  }

  function openCreate() {
    setTemplateToEdit(null);
    setCreateOpen(true);
  }

  function openEdit(template: PromptTemplateItem) {
    setTemplateToEdit(template);
    setCreateOpen(true);
  }

  return (
    <div className="space-y-6 font-google-sans">
      {/* Header bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] sm:text-2xl">
            {t("Prompt Templates")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("Configure and test structured prompt templates, variables, and model generation parameters.")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-[#003377] shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#003377] px-5 text-xs font-bold text-white shadow-md transition hover:bg-[#002255] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
          >
            <Plus className="h-4 w-4" />
            {t("Create Template")}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <PromptTemplateStats
        templates={templates}
        totalElements={totalElements}
        isLoading={isLoading}
      />

      {/* Filters row */}
      <PromptTemplateFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        resultCount={totalElements}
      />

      {/* Table view */}
      <PromptTemplateTable
        templates={templates}
        isLoading={isLoading}
        onViewDetails={openDetails}
        onTest={openTest}
        onVersionHistory={openHistory}
        onEdit={openEdit}
      />

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{t("Showing")}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {pageNumber * pageSize + 1}
            </span>
            <span>-</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {Math.min((pageNumber + 1) * pageSize, totalElements)}
            </span>
            <span>{t("of")}</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {totalElements}
            </span>

            <span className="ml-4">{t("Rows per page")}:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val));
                setPageNumber(0);
              }}
            >
              <SelectTrigger className="h-8 w-16 rounded-xl text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageNumber === 0}
              onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("Previous")}
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {pageNumber + 1} / {totalPages}
            </span>
            <button
              type="button"
              disabled={pageNumber >= totalPages - 1}
              onClick={() => setPageNumber((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <PromptTemplateDetailsDialog
        template={selectedTemplate}
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onOpenTest={openTest}
      />

      <PromptTemplateTestDialog
        template={selectedTemplate}
        isOpen={testOpen}
        onClose={() => setTestOpen(false)}
      />

      <PromptTemplateVersionHistoryDialog
        template={selectedTemplate}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <PromptTemplateCreateDialog
        templateToEdit={templateToEdit}
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
