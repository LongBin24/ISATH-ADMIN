"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Code2,
  Sparkles,
  Sliders,
  FileCode,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { LanguageFlag } from "@/components/ui/LanguageFlag";
import { useGetPromptTemplateByIdQuery } from "../api";
import type { PromptTemplateItem } from "../types";

interface PromptTemplateDetailsDialogProps {
  template: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTest?: (template: PromptTemplateItem) => void;
}

export function PromptTemplateDetailsDialog({
  template: initialTemplate,
  isOpen,
  onClose,
  onOpenTest,
}: PromptTemplateDetailsDialogProps) {
  const { t } = useAdminI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: fetchedTemplate } = useGetPromptTemplateByIdQuery(
    initialTemplate?.id || "",
    {
      skip: !initialTemplate?.id || !isOpen,
    }
  );

  const template = fetchedTemplate || initialTemplate;

  if (!template) return null;

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function formatDate(val?: string | null) {
    if (!val) return "N/A";
    try {
      return format(new Date(val), "PPpp");
    } catch {
      return val;
    }
  }

  const isKhmer = template.languageCode === "km";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl p-0 font-google-sans">
        {/* Fixed Header */}
        <DialogHeader className="relative shrink-0 border-b border-slate-100 bg-white/95 px-6 py-4.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-8 sm:py-5 z-10 space-y-2.5">
          <div className="flex items-start gap-3 pr-11 sm:pr-12">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D] mt-0.5 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="space-y-1.5 flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white sm:text-2xl leading-tight">
                {template.templateName}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <code className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {template.templateKey}
                </code>
              </div>

              {/* Sub-header Badges: Status, Language with GB/KH, Version */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    template.templateStatus === "ACTIVE"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : template.templateStatus === "DRAFT"
                      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {template.templateStatus ? t(template.templateStatus) : "N/A"}
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 inline-flex items-center gap-1.5"
                >
                  <LanguageFlag locale={template.languageCode} className="w-4 h-3" />
                  <span>{isKhmer ? t("Khmer (km)") : t("English (en)")}</span>
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-full border-[#FFC83D] bg-[#FFC83D]/15 px-3 py-1 text-xs font-bold text-[#003377] transition-all duration-150 hover:bg-[#FFC83D]/30 hover:border-[#FFC83D] dark:text-[#FFC83D]"
                >
                  v{template.version}
                </Badge>

                {template.isDefault && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-800 dark:text-emerald-400">
                    {t("Default")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {template.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pr-11 sm:pr-12 pt-0.5">
              {template.description}
            </p>
          )}

          {/* Absolute Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            title={t("Close")}
            className="absolute top-4 right-4 sm:top-5 sm:right-6 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-100/80 text-slate-600 shadow-sm transition-all duration-150 hover:bg-slate-200 hover:border-[#003377] hover:text-[#003377] active:scale-90 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Metadata Chips */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Task Type")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {template.taskType ? t(template.taskType) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Scope")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {template.templateScope ? t(template.templateScope) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Model")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs font-mono">
                {template.modelName || t("Default Platform Model")}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Created")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {formatDate(template.createdAt)}
              </p>
            </div>
          </div>

          {/* System Prompt Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] flex items-center gap-1.5">
                <FileCode className="h-4 w-4" /> {t("System Prompt")}
              </h4>
              <button
                type="button"
                onClick={() => copyText(template.systemPrompt, "system")}
                className="inline-flex items-center gap-1 text-xs text-slate-500 transition-all duration-150 hover:text-[#003377] active:scale-90 active:text-[#FFC83D] dark:hover:text-[#FFC83D]"
              >
                {copiedKey === "system" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "system" ? t("Copied") : t("Copy")}
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 font-mono whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {template.systemPrompt || "N/A"}
            </div>
          </div>

          {/* User Prompt Template Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] flex items-center gap-1.5">
                <Code2 className="h-4 w-4" /> {t("User Prompt Template")}
              </h4>
              <button
                type="button"
                onClick={() => copyText(template.userPromptTemplate, "user")}
                className="inline-flex items-center gap-1 text-xs text-slate-500 transition-all duration-150 hover:text-[#003377] active:scale-90 active:text-[#FFC83D] dark:hover:text-[#FFC83D]"
              >
                {copiedKey === "user" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "user" ? t("Copied") : t("Copy")}
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 font-mono whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {template.userPromptTemplate || "N/A"}
            </div>
          </div>

          {/* Schemas & Generation Config Grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Input Schema */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("Input Schema")}
              </h4>
              <pre className="max-h-48 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {JSON.stringify(template.inputSchema || {}, null, 2)}
              </pre>
            </div>

            {/* Output Schema */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t("Output Schema")}
              </h4>
              <pre className="max-h-48 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {JSON.stringify(template.outputSchema || {}, null, 2)}
              </pre>
            </div>

            {/* Generation Config */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sliders className="h-3.5 w-3.5" /> {t("Generation Config")}
              </h4>
              <pre className="max-h-48 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 text-[11px] font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {JSON.stringify(template.generationConfig || {}, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Fixed Action footer */}
        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ID: <span className="font-mono">{template.id}</span>
          </p>
          <div className="flex gap-2">
            {onOpenTest && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTest(template);
                }}
                className="rounded-xl bg-[#FFC83D] px-4 py-2 text-xs font-bold text-[#003377] shadow-sm transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-md active:scale-95 active:bg-[#003377] active:text-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
              >
                {t("Test Prompt Template")}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
