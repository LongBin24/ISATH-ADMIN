"use client";

import { useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
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

  const rawTemplates = useMemo(() => pageData?.content || [], [pageData?.content]);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    (filters.search && filters.search.trim() !== "") ||
      filters.taskType !== "ALL" ||
      filters.templateScope !== "ALL" ||
      filters.languageCode !== "ALL" ||
      filters.templateStatus !== "ALL"
  );

  // Client-side filtering ensures filters always work immediately and reliably
  const filteredTemplates = useMemo(() => {
    if (!hasActiveFilters) return rawTemplates;

    return rawTemplates.filter((item) => {
      // 1. Search term filter
      if (filters.search && filters.search.trim() !== "") {
        const term = filters.search.toLowerCase().trim();
        const name = (item.templateName || item.name || "").toLowerCase();
        const key = (item.templateKey || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const sys = (item.systemPrompt || "").toLowerCase();
        const usr = (item.userPromptTemplate || item.template || "").toLowerCase();
        const model = (item.modelName || "").toLowerCase();

        const match =
          name.includes(term) ||
          key.includes(term) ||
          desc.includes(term) ||
          sys.includes(term) ||
          usr.includes(term) ||
          model.includes(term);

        if (!match) return false;
      }

      // 2. Task Type filter
      if (filters.taskType !== "ALL") {
        if (item.taskType !== filters.taskType) return false;
      }

      // 3. Template Scope filter
      if (filters.templateScope !== "ALL") {
        if (item.templateScope !== filters.templateScope) return false;
      }

      // 4. Language Code filter
      if (filters.languageCode !== "ALL") {
        if (item.languageCode !== filters.languageCode) return false;
      }

      // 5. Template Status filter
      if (filters.templateStatus !== "ALL") {
        const itemStatus = item.templateStatus || item.status;
        if (itemStatus !== filters.templateStatus) return false;
      }

      return true;
    });
  }, [rawTemplates, filters, hasActiveFilters]);

  const templates = hasActiveFilters ? filteredTemplates : rawTemplates;
  const totalElements = hasActiveFilters ? filteredTemplates.length : (pageData?.totalElements ?? rawTemplates.length);
  const totalPages = hasActiveFilters
    ? Math.max(1, Math.ceil(filteredTemplates.length / pageSize))
    : (pageData?.totalPages ?? 1);

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

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-semibold text-[#003377] shadow-sm transition-all duration-150 hover:bg-slate-50 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:text-[#003377] active:border-[#FFC83D] disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] shadow-md shadow-[#FFC83D]/20 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg hover:scale-[1.02] active:scale-95 active:bg-[#003377] active:text-[#FFC83D] active:shadow-inner dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
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
              <SelectTrigger className="h-8 w-16 rounded-xl text-xs transition-all duration-150 hover:border-[#FFC83D] dark:hover:border-[#FFC83D] data-[state=open]:border-[#003377] dark:data-[state=open]:border-[#FFC83D]">
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
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
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
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-50 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] disabled:opacity-40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
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
