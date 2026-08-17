"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { History, Plus, FileCode, CheckCircle2, Clock, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { format } from "date-fns";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  useGetPromptTemplateVersionsQuery,
  useCreatePromptTemplateVersionMutation,
} from "../api";
import type { PromptTemplateItem, PromptTemplateVersion } from "../types";

interface PromptTemplateVersionHistoryDialogProps {
  template: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptTemplateVersionHistoryDialog({
  template,
  isOpen,
  onClose,
}: PromptTemplateVersionHistoryDialogProps) {
  const { t } = useAdminI18n();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPromptTemplate, setUserPromptTemplate] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    data: versions = [],
    isLoading,
    refetch,
  } = useGetPromptTemplateVersionsQuery(template?.id || "", {
    skip: !template?.id || !isOpen,
  });

  const [createVersion, { isLoading: isCreating }] =
    useCreatePromptTemplateVersionMutation();

  if (!template) return null;

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  async function handleCreateVersion(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);

    try {
      await createVersion({
        templateId: template!.id,
        systemPrompt: systemPrompt || template!.systemPrompt,
        userPromptTemplate: userPromptTemplate || template!.userPromptTemplate,
        versionNote,
      }).unwrap();

      setSuccessMsg(t("New version created successfully."));
      setVersionNote("");
      setActiveTab("list");
      refetch();
    } catch {
      // Handled
    }
  }

  function formatDate(val?: string | null) {
    if (!val) return "—";
    try {
      return format(new Date(val), "PPp");
    } catch {
      return val;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D]">
                <History className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white">
                  {t("Version History")}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {template.templateName} (Current: v{template.version})
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("list");
                  setSuccessMsg(null);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "list"
                    ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {t("History")} ({versions.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("create");
                  setSystemPrompt(template.systemPrompt);
                  setUserPromptTemplate(template.userPromptTemplate);
                  setSuccessMsg(null);
                }}
                className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  activeTab === "create"
                    ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("New Version")}
              </button>
            </div>
          </div>
        </DialogHeader>

        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        {activeTab === "list" ? (
          <div className="space-y-4 pt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : versions.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("No separate version records found. Template is currently at version")} v{template.version}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((ver) => {
                  const isExpanded = expandedVersionId === ver.id;
                  const isKhmer = ver.languageCode === "km";

                  return (
                    <div
                      key={ver.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-full border-[#FFC83D] bg-[#FFC83D]/15 text-[#003377] dark:text-[#FFC83D] font-bold text-xs"
                          >
                            v{ver.version || ver.versionNumber || template.version}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="rounded-full border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300"
                          >
                            {isKhmer ? "🇰🇭 km" : "🇬🇧 en"}
                          </Badge>

                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(ver.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {ver.isDefault && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              {t("Default")}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedVersionId(isExpanded ? null : ver.id)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {isExpanded ? (
                              <>
                                <span>{t("Hide")}</span>
                                <ChevronUp className="h-3.5 w-3.5" />
                              </>
                            ) : (
                              <>
                                <span>{t("Inspect")}</span>
                                <ChevronDown className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {ver.description && (
                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                          {ver.description}
                        </p>
                      )}

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-4 space-y-3 border-t border-slate-200/80 pt-3 dark:border-slate-800">
                          {/* System Prompt */}
                          {ver.systemPrompt && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                                <span>{t("System Prompt")}</span>
                                <button
                                  type="button"
                                  onClick={() => copyText(ver.systemPrompt!, `sys_${ver.id}`)}
                                  className="text-[11px] font-normal text-slate-500 hover:text-slate-900"
                                >
                                  {copiedKey === `sys_${ver.id}` ? t("Copied") : t("Copy")}
                                </button>
                              </div>
                              <pre className="max-h-36 overflow-auto rounded-xl bg-white p-2.5 font-mono text-[11px] text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                {ver.systemPrompt}
                              </pre>
                            </div>
                          )}

                          {/* User Prompt Template */}
                          {ver.userPromptTemplate && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                                <span>{t("User Prompt Template")}</span>
                                <button
                                  type="button"
                                  onClick={() => copyText(ver.userPromptTemplate!, `usr_${ver.id}`)}
                                  className="text-[11px] font-normal text-slate-500 hover:text-slate-900"
                                >
                                  {copiedKey === `usr_${ver.id}` ? t("Copied") : t("Copy")}
                                </button>
                              </div>
                              <pre className="max-h-36 overflow-auto rounded-xl bg-white p-2.5 font-mono text-[11px] text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                {ver.userPromptTemplate}
                              </pre>
                            </div>
                          )}

                          {/* Generation Config & Model */}
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                            {ver.modelName && (
                              <span>
                                {t("Model")}: <strong className="font-mono">{ver.modelName}</strong>
                              </span>
                            )}
                            {ver.generationConfig && (
                              <span>
                                {t("Config")}:{" "}
                                <strong className="font-mono">
                                  {JSON.stringify(ver.generationConfig)}
                                </strong>
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex gap-2 text-[11px] text-slate-400">
                        <span>ID: <code className="font-mono">{ver.id}</code></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateVersion} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Version Note / Changelog")}
              </label>
              <input
                type="text"
                value={versionNote}
                onChange={(e) => setVersionNote(e.target.value)}
                placeholder={t("e.g. Updated financial context accuracy rules")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("System Prompt")}
              </label>
              <textarea
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("User Prompt Template")}
              </label>
              <textarea
                rows={4}
                value={userPromptTemplate}
                onChange={(e) => setUserPromptTemplate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t("Cancel")}
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="rounded-xl bg-[#003377] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#002255] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
              >
                {isCreating ? t("Creating...") : t("Save Version")}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
