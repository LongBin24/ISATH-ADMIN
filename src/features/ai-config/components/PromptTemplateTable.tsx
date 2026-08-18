"use client";

import {
  Eye,
  Play,
  History,
  MoreHorizontal,
  Edit,
  Archive,
  CheckCircle2,
  Star,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  useSetDefaultPromptTemplateMutation,
  useArchivePromptTemplateMutation,
  useActivatePromptTemplateMutation,
} from "../api";
import type { PromptTemplateItem } from "../types";

interface PromptTemplateTableProps {
  templates: PromptTemplateItem[];
  isLoading?: boolean;
  onViewDetails: (template: PromptTemplateItem) => void;
  onTest: (template: PromptTemplateItem) => void;
  onVersionHistory: (template: PromptTemplateItem) => void;
  onEdit: (template: PromptTemplateItem) => void;
}

export function PromptTemplateTable({
  templates,
  isLoading,
  onViewDetails,
  onTest,
  onVersionHistory,
  onEdit,
}: PromptTemplateTableProps) {
  const { t } = useAdminI18n();

  const [setDefault] = useSetDefaultPromptTemplateMutation();
  const [archiveTemplate] = useArchivePromptTemplateMutation();
  const [activateTemplate] = useActivatePromptTemplateMutation();

  function formatDate(val?: string | null) {
    if (!val) return "—";
    try {
      const date = new Date(val);
      return format(date, "MMM dd, yyyy");
    } catch {
      return val;
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Sparkles className="h-7 w-7" />
        </span>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          {t("No prompt templates found")}
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          {t("Try adjusting your search criteria or filter options to find templates.")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-slate-50/75 transition-colors hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80">
              <TableHead className="py-4 pl-6 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Template")}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Task & Scope")}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Language")}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Version")}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Status")}
              </TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Updated")}
              </TableHead>
              <TableHead className="pr-6 text-right text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {templates.map((tmpl) => {
              const isKhmer = tmpl.languageCode === "km";
              const isActive = tmpl.templateStatus === "ACTIVE";

              return (
                <TableRow
                  key={tmpl.id}
                  className="group border-b border-slate-100 transition hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/30"
                >
                  {/* Template Info */}
                  <TableCell className="py-4 pl-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewDetails(tmpl)}
                          className="text-left font-bold text-[#003377] transition hover:text-[#002255] hover:underline dark:text-slate-100 dark:hover:text-[#FFC83D]"
                        >
                          {tmpl.templateName}
                        </button>
                        {tmpl.isDefault && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {t("Default")}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                        {tmpl.templateKey}
                      </p>
                      {tmpl.description && (
                        <p className="line-clamp-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                          {tmpl.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Task & Scope */}
                  <TableCell>
                    <div className="space-y-1">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {tmpl.taskType ? t(tmpl.taskType) : "—"}
                      </span>
                      {tmpl.templateScope && (
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {t(tmpl.templateScope)}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Language */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isKhmer
                          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300"
                          : "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/30 dark:text-purple-300"
                      }`}
                    >
                      {isKhmer ? "🇰🇭 km" : "🇬🇧 en"}
                    </Badge>
                  </TableCell>

                  {/* Version */}
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => onVersionHistory(tmpl)}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/15 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:hover:shadow-[0_0_10px_rgba(255,200,61,0.2)] dark:active:bg-[#FFC83D]/20"
                    >
                      <span>v{tmpl.version}</span>
                      <History className="h-3.5 w-3.5 text-slate-400 transition-colors" />
                    </button>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : tmpl.templateStatus === "DRAFT"
                          ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                          : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {tmpl.templateStatus ? t(tmpl.templateStatus) : "—"}
                    </Badge>
                  </TableCell>

                  {/* Updated */}
                  <TableCell className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(tmpl.updatedAt || tmpl.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Quick Test Button */}
                      <button
                        type="button"
                        onClick={() => onTest(tmpl)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-150 hover:border-[#FFC83D] hover:bg-[#FFC83D]/20 hover:text-[#003377] active:scale-95 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-800 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
                        title={t("Test Prompt")}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                      </button>

                      {/* Dropdown for more actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 font-google-sans dark:border-slate-800 dark:bg-slate-900">
                          <DropdownMenuItem
                            onClick={() => onViewDetails(tmpl)}
                            className="cursor-pointer gap-2 rounded-xl text-xs dark:hover:text-[#FFC83D] dark:focus:text-[#FFC83D]"
                          >
                            <Eye className="h-4 w-4" /> {t("View Details")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onTest(tmpl)}
                            className="cursor-pointer gap-2 rounded-xl text-xs dark:hover:text-[#FFC83D] dark:focus:text-[#FFC83D]"
                          >
                            <Play className="h-4 w-4" /> {t("Test Prompt")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onVersionHistory(tmpl)}
                            className="cursor-pointer gap-2 rounded-xl text-xs dark:hover:text-[#FFC83D] dark:focus:text-[#FFC83D]"
                          >
                            <History className="h-4 w-4" /> {t("Version History")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEdit(tmpl)}
                            className="cursor-pointer gap-2 rounded-xl text-xs dark:hover:text-[#FFC83D] dark:focus:text-[#FFC83D]"
                          >
                            <Edit className="h-4 w-4" /> {t("Edit Template")}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {!tmpl.isDefault && (
                            <DropdownMenuItem
                              onClick={() => setDefault(tmpl.id)}
                              className="cursor-pointer gap-2 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              <Star className="h-4 w-4" /> {t("Set as Default")}
                            </DropdownMenuItem>
                          )}

                          {!isActive ? (
                            <DropdownMenuItem
                              onClick={() => activateTemplate(tmpl.id)}
                              className="cursor-pointer gap-2 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                              <CheckCircle2 className="h-4 w-4" /> {t("Activate")}
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => archiveTemplate(tmpl.id)}
                              className="cursor-pointer gap-2 rounded-xl text-xs text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
                            >
                              <Archive className="h-4 w-4" /> {t("Archive")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
