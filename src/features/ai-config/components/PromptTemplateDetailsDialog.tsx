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
  Calendar,
  Sparkles,
  Sliders,
  FileCode,
  Globe,
  Tag,
  Clock,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminI18n } from "@/i18n/admin-i18n";
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
    if (!val) return "—";
    try {
      return format(new Date(val), "PPpp");
    } catch {
      return val;
    }
  }

  const isKhmer = template.languageCode === "km";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white sm:text-2xl">
                  {template.templateName}
                </DialogTitle>
                <code className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {template.templateKey}
                </code>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                {template.templateStatus}
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {isKhmer ? "🇰🇭 Khmer (km)" : "🇬🇧 English (en)"}
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full border-[#FFC83D]/40 bg-[#FFC83D]/15 px-3 py-1 text-xs font-semibold text-[#003377] dark:text-[#FFC83D]"
              >
                v{template.version}
              </Badge>

              {template.isDefault && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {t("Default")}
                </span>
              )}
            </div>
          </div>

          {template.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {template.description}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Metadata Chips */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Task Type")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {template.taskType || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t("Scope")}</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200 text-xs">
                {template.templateScope || "—"}
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
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {copiedKey === "system" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "system" ? t("Copied") : t("Copy")}
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 font-mono whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {template.systemPrompt || "—"}
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
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              >
                {copiedKey === "user" ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey === "user" ? t("Copied") : t("Copy")}
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs leading-relaxed text-slate-800 font-mono whitespace-pre-wrap dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {template.userPromptTemplate || "—"}
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

          {/* Action footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
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
                  className="rounded-xl bg-[#003377] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#002255] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
                >
                  {t("Test Prompt Template")}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
