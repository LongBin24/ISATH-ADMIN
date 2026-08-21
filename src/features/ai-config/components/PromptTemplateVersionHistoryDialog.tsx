"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  History,
  Plus,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Sparkles,
  Code2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Layers,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  useGetPromptTemplateVersionsQuery,
  useCreatePromptTemplateVersionMutation,
  useSetDefaultPromptTemplateMutation,
} from "../api";
import { promptTemplateVersionSchema } from "../schemas";
import type {
  PromptTemplateItem,
  PromptTemplateVersion,
  TaskType,
  TemplateScope,
  LanguageCode,
  PromptTemplateStatus,
  JsonSchema,
} from "../types";

interface PromptTemplateVersionHistoryDialogProps {
  template: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTest?: (template: PromptTemplateItem) => void;
}

export function PromptTemplateVersionHistoryDialog({
  template,
  isOpen,
  onClose,
}: PromptTemplateVersionHistoryDialogProps) {
  const { t } = useAdminI18n();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Create form state
  const [templateKey, setTemplateKey] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("CATEGORY_PREDICTION");
  const [templateScope, setTemplateScope] = useState<TemplateScope>("GENERAL_CONVERSATION");
  const [languageCode, setLanguageCode] = useState<LanguageCode>("en");
  const [templateStatus, setTemplateStatus] = useState<PromptTemplateStatus>("DRAFT");
  const [isDefault, setIsDefault] = useState(false);
  const [modelName, setModelName] = useState("gemini-2.5-flash");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPromptTemplate, setUserPromptTemplate] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [temperature, setTemperature] = useState<number>(0);
  const [responseMimeType, setResponseMimeType] = useState("application/json");

  // Advanced JSON Schema inputs
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputSchemaJson, setInputSchemaJson] = useState("");
  const [outputSchemaJson, setOutputSchemaJson] = useState("");
  const [schemaError, setSchemaError] = useState<string | null>(null);

  const {
    data: versions = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetPromptTemplateVersionsQuery(template?.id || "", {
    skip: !template?.id || !isOpen,
  });

  const [createVersion, { isLoading: isCreating }] =
    useCreatePromptTemplateVersionMutation();
  const [setDefaultTemplate, { isLoading: isSettingDefault }] =
    useSetDefaultPromptTemplateMutation();

  function populateFormFromSource(source: PromptTemplateItem | PromptTemplateVersion) {
    const raw = source as Record<string, unknown>;
    setTemplateKey(source.templateKey || template?.templateKey || "");
    setTemplateName(
      source.templateName || (typeof raw.name === "string" ? raw.name : "") || template?.templateName || ""
    );
    setDescription(source.description || "");
    setTaskType((source.taskType as TaskType) || "CATEGORY_PREDICTION");
    setTemplateScope((source.templateScope as TemplateScope) || "GENERAL_CONVERSATION");
    setLanguageCode((source.languageCode as LanguageCode) || "en");
    setTemplateStatus((source.templateStatus as PromptTemplateStatus) || "DRAFT");
    setIsDefault(Boolean(source.isDefault));
    setModelName(source.modelName || "gemini-2.5-flash");
    setSystemPrompt(source.systemPrompt || "");
    setUserPromptTemplate(
      source.userPromptTemplate || (typeof raw.template === "string" ? raw.template : "") || ""
    );
    setVersionNote(
      (typeof source.versionNote === "string" ? source.versionNote : "") ||
      (typeof raw.notes === "string" ? raw.notes : "") ||
      (typeof raw.changelog === "string" ? raw.changelog : "") ||
      ""
    );

    const genConfig = source.generationConfig as
      | { temperature?: number; responseMimeType?: string }
      | undefined;
    setTemperature(typeof genConfig?.temperature === "number" ? genConfig.temperature : 0);
    setResponseMimeType(typeof genConfig?.responseMimeType === "string" ? genConfig.responseMimeType : "application/json");

    setInputSchemaJson(
      source.inputSchema ? JSON.stringify(source.inputSchema, null, 2) : ""
    );
    setOutputSchemaJson(
      source.outputSchema ? JSON.stringify(source.outputSchema, null, 2) : ""
    );
    setShowAdvanced(Boolean(source.inputSchema || source.outputSchema));
  }

  useEffect(() => {
    if (template && isOpen) {
      queueMicrotask(() => {
        populateFormFromSource(template);
        setSuccessMsg(null);
        setErrorMsg(null);
        setSchemaError(null);
      });
    }
  }, [template, isOpen]);

  if (!template) return null;

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function handleCloneVersion(ver: PromptTemplateVersion) {
    populateFormFromSource(ver);
    setVersionNote(`Cloned from version v${ver.version || ver.versionNumber || "prev"}`);
    setActiveTab("create");
    setSuccessMsg(null);
    setErrorMsg(null);
  }

  async function handleSetDefault(ver: PromptTemplateVersion) {
    if (!template) return;
    try {
      await setDefaultTemplate({
        templateId: template.id,
        versionId: ver.id,
      }).unwrap();
      setSuccessMsg(t(`Version v${ver.version ?? ver.versionNumber} is now set as default.`));
      refetch();
    } catch {
      setErrorMsg(t("Failed to set default version."));
    }
  }

  async function handleCreateVersion(e: React.FormEvent) {
    e.preventDefault();
    if (!template) return;

    setSuccessMsg(null);
    setErrorMsg(null);
    setSchemaError(null);
    setFieldErrors({});

    let parsedInputSchema: JsonSchema | Record<string, unknown> | null = null;
    let parsedOutputSchema: JsonSchema | Record<string, unknown> | null = null;

    if (inputSchemaJson.trim()) {
      try {
        parsedInputSchema = JSON.parse(inputSchemaJson);
      } catch (err: unknown) {
        setSchemaError(
          t("Invalid JSON in Input Schema: ") +
            (err instanceof Error ? err.message : "Syntax error")
        );
        return;
      }
    }

    if (outputSchemaJson.trim()) {
      try {
        parsedOutputSchema = JSON.parse(outputSchemaJson);
      } catch (err: unknown) {
        setSchemaError(
          t("Invalid JSON in Output Schema: ") +
            (err instanceof Error ? err.message : "Syntax error")
        );
        return;
      }
    }

    const formValues = {
      templateKey: templateKey.trim().toLowerCase() || template.templateKey,
      templateName: templateName.trim() || template.templateName,
      description: description.trim() || undefined,
      taskType,
      templateScope: templateScope || undefined,
      languageCode,
      systemPrompt: systemPrompt.trim(),
      userPromptTemplate: userPromptTemplate.trim(),
      versionNote: versionNote.trim() || undefined,
      modelName: modelName.trim() || "gemini-2.5-flash",
      temperature,
      responseMimeType,
      templateStatus,
      isDefault,
      inputSchemaJson: inputSchemaJson.trim() || undefined,
      outputSchemaJson: outputSchemaJson.trim() || undefined,
    };

    const zodResult = promptTemplateVersionSchema.safeParse(formValues);

    if (!zodResult.success) {
      const flattened = zodResult.error.flatten();
      setFieldErrors(flattened.fieldErrors as Record<string, string[]>);
      const firstIssue = zodResult.error.issues[0]?.message || t("Please correct the form errors.");
      setErrorMsg(firstIssue);
      return;
    }

    try {
      const payload = {
        templateKey: formValues.templateKey,
        templateName: formValues.templateName,
        description: formValues.description,
        taskType: formValues.taskType,
        templateScope: formValues.templateScope,
        languageCode: formValues.languageCode,
        systemPrompt: formValues.systemPrompt,
        userPromptTemplate: formValues.userPromptTemplate,
        inputSchema: parsedInputSchema,
        outputSchema: parsedOutputSchema,
        modelName: formValues.modelName,
        generationConfig: {
          temperature: formValues.temperature,
          responseMimeType: formValues.responseMimeType,
        },
        templateStatus: formValues.templateStatus,
        isDefault: formValues.isDefault,
        versionNote: formValues.versionNote,
      };

      await createVersion({
        templateId: template.id,
        body: payload,
      }).unwrap();

      setSuccessMsg(t("New prompt template version created successfully (POST /api/v1/admin/ai/prompt-templates/{templateId}/versions)."));
      setVersionNote("");
      setActiveTab("list");
      refetch();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const data = (err as { data: Record<string, unknown> }).data;
        if (Array.isArray(data?.fieldErrors) && data.fieldErrors.length > 0) {
          const formatted = data.fieldErrors
            .map(
              (f: { field?: string; message?: string }) =>
                `${f.field ? `[${f.field}] ` : ""}${f.message}`
            )
            .join(" | ");
          setErrorMsg(formatted);
          return;
        }
        if (typeof data?.message === "string") {
          setErrorMsg(data.message);
          return;
        }
      }
      setErrorMsg(t("An unexpected error occurred while creating the version."));
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
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl p-0 font-google-sans">
        {/* Fixed Header */}
        <DialogHeader className="relative shrink-0 border-b border-slate-100 bg-white/95 px-6 py-4.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-8 sm:py-5 z-10 space-y-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-11 sm:pr-12">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D]">
                <History className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white sm:text-2xl">
                  {t("Version History & Management")}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{template.templateName}</span>
                  <span>•</span>
                  <code className="font-mono text-[11px] text-slate-400">{template.templateKey}</code>
                  <span>•</span>
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-[#FFC83D] bg-[#FFC83D]/10 text-[#003377] dark:text-[#FFC83D] font-bold">
                    {t("Active")}: v{template.version}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                title={t("Refresh versions")}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:border-[#003377] hover:text-[#003377] active:scale-90 active:bg-[#FFC83D]/20 active:border-[#FFC83D] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("list");
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                  activeTab === "list"
                    ? "bg-[#FFC83D] text-[#003377] font-bold shadow-sm active:bg-[#003377] active:text-[#FFC83D]"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:text-[#003377] active:bg-[#FFC83D]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20"
                }`}
              >
                {t("History")} ({versions.length})
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("create");
                  populateFormFromSource(template);
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 shadow-sm active:scale-95 ${
                  activeTab === "create"
                    ? "bg-[#FFC83D] text-[#003377] shadow-md shadow-[#FFC83D]/15 active:bg-[#003377] active:text-[#FFC83D]"
                    : "bg-[#003377] text-white hover:bg-[#002255] hover:shadow active:bg-[#FFC83D] active:text-[#003377] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
                }`}
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                {t("Create New Version")}
              </button>
            </div>
          </div>

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

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === "list" ? (
            <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                ))}
              </div>
            ) : versions.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                  <Layers className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t("No distinct version snapshots recorded")}
                </h4>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                  {t("The template is currently operating at version")} v{template.version}. {t("Click 'Create New Version' above to draft and commit version")} v{(template.version || 1) + 1}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    populateFormFromSource(template);
                    setActiveTab("create");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#003377] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#002255] hover:shadow active:scale-95 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("Create v")}{(template.version || 1) + 1}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((ver) => {
                  const isExpanded = expandedVersionId === ver.id;
                  const isKhmer = ver.languageCode === "km";
                  const verNum = ver.version ?? ver.versionNumber ?? template.version;

                  return (
                    <div
                      key={ver.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4 transition-all duration-200 hover:bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-full border-[#FFC83D] bg-[#FFC83D]/15 px-3 py-0.5 text-xs font-bold text-[#003377] transition-all duration-150 hover:bg-[#FFC83D]/30 hover:border-[#FFC83D] dark:text-[#FFC83D]"
                          >
                            v{verNum}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="rounded-full border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300"
                          >
                            {isKhmer ? t("Khmer (km)") : t("English (en)")}
                          </Badge>

                          {ver.taskType && (
                            <Badge variant="outline" className="rounded-full text-[10px] text-slate-600 dark:text-slate-400">
                              {t(ver.taskType)}
                            </Badge>
                          )}

                          {ver.templateStatus && (
                            <Badge
                              variant="outline"
                              className={`rounded-full text-[10px] font-semibold ${
                                ver.templateStatus === "ACTIVE"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                                  : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300"
                              }`}
                            >
                              {t(ver.templateStatus)}
                            </Badge>
                          )}

                          {ver.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <Check className="h-3 w-3" />
                              {t("Default Version")}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {!ver.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(ver)}
                              disabled={isSettingDefault}
                              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                            >
                              {t("Set Default")}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleCloneVersion(ver)}
                            className="rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition-all duration-150 hover:bg-blue-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D] active:text-[#003377] active:border-[#FFC83D] dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
                          >
                            {t("Clone to Draft")}
                          </button>

                          <button
                            type="button"
                            onClick={() => setExpandedVersionId(isExpanded ? null : ver.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-50 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                          >
                            {isExpanded ? (
                              <>
                                <span>{t("Collapse")}</span>
                                <ChevronUp className="h-3.5 w-3.5" />
                              </>
                            ) : (
                              <>
                                <span>{t("Inspect Details")}</span>
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

                      {ver.versionNote && (
                        <div className="mt-2 rounded-xl bg-blue-50/70 p-2 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-200">
                          <strong className="font-semibold">{t("Changelog")}:</strong> {ver.versionNote}
                        </div>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                        <span>ID: <code className="font-mono">{ver.id}</code></span>
                        {ver.modelName && (
                          <span>{t("Model")}: <code className="font-mono text-slate-600 dark:text-slate-300">{ver.modelName}</code></span>
                        )}
                        <span>{t("Created")}: {formatDate(ver.createdAt)}</span>
                        {ver.createdBy && (
                          <span>{t("By")}: <code className="font-mono text-[10px]">{ver.createdBy}</code></span>
                        )}
                      </div>

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4 dark:border-slate-800">
                          {/* System Prompt */}
                          {ver.systemPrompt && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                                <span>{t("System Prompt")}</span>
                                <button
                                  type="button"
                                  onClick={() => copyText(ver.systemPrompt!, `sys_${ver.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D]"
                                >
                                  {copiedKey === `sys_${ver.id}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  {copiedKey === `sys_${ver.id}` ? t("Copied") : t("Copy")}
                                </button>
                              </div>
                              <pre className="max-h-48 overflow-auto rounded-2xl border border-slate-100 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                {ver.systemPrompt}
                              </pre>
                            </div>
                          )}

                          {/* User Prompt Template */}
                          {ver.userPromptTemplate && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                                <span>{t("User Prompt Template")}</span>
                                <button
                                  type="button"
                                  onClick={() => copyText(ver.userPromptTemplate!, `usr_${ver.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D]"
                                >
                                  {copiedKey === `usr_${ver.id}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  {copiedKey === `usr_${ver.id}` ? t("Copied") : t("Copy")}
                                </button>
                              </div>
                              <pre className="max-h-36 overflow-auto rounded-2xl border border-slate-100 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                {ver.userPromptTemplate}
                              </pre>
                            </div>
                          )}

                          {/* Generation Config */}
                          {ver.generationConfig && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                                <span>{t("Generation Config")}</span>
                                <button
                                  type="button"
                                  onClick={() => copyText(JSON.stringify(ver.generationConfig, null, 2), `gen_${ver.id}`)}
                                  className="inline-flex items-center gap-1 text-[11px] font-normal text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D]"
                                >
                                  {copiedKey === `gen_${ver.id}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                                  {copiedKey === `gen_${ver.id}` ? t("Copied") : t("Copy")}
                                </button>
                              </div>
                              <pre className="max-h-36 overflow-auto rounded-2xl border border-slate-100 bg-white p-3 font-mono text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                {JSON.stringify(ver.generationConfig, null, 2)}
                              </pre>
                            </div>
                          )}

                          {/* Input Schema & Output Schema */}
                          {(ver.inputSchema || ver.outputSchema) && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {ver.inputSchema && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>{t("Input Schema")}</span>
                                    <button
                                      type="button"
                                      onClick={() => copyText(JSON.stringify(ver.inputSchema, null, 2), `in_${ver.id}`)}
                                      className="text-[11px] font-normal text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D]"
                                    >
                                      {copiedKey === `in_${ver.id}` ? t("Copied") : t("Copy")}
                                    </button>
                                  </div>
                                  <pre className="max-h-36 overflow-auto rounded-2xl border border-slate-100 bg-white p-2.5 font-mono text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                    {JSON.stringify(ver.inputSchema, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {ver.outputSchema && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <span>{t("Output Schema")}</span>
                                    <button
                                      type="button"
                                      onClick={() => copyText(JSON.stringify(ver.outputSchema, null, 2), `out_${ver.id}`)}
                                      className="text-[11px] font-normal text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D]"
                                    >
                                      {copiedKey === `out_${ver.id}` ? t("Copied") : t("Copy")}
                                    </button>
                                  </div>
                                  <pre className="max-h-36 overflow-auto rounded-2xl border border-slate-100 bg-white p-2.5 font-mono text-[11px] text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                                    {JSON.stringify(ver.outputSchema, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Raw JSON copy button */}
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => copyText(JSON.stringify(ver, null, 2), `raw_${ver.id}`)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                              {copiedKey === `raw_${ver.id}` ? t("Version JSON Copied!") : t("Copy Version JSON")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* List Tab Footer Close Button */}
            {versions.length > 0 && (
              <div className="flex items-center justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#FFC83D] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                >
                  {t("Close")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleCreateVersion} className="space-y-5 pt-4">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                <Sparkles className="h-4 w-4" />
                <span>{t("POST /api/v1/admin/ai/prompt-templates/{templateId}/versions")}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {t("Publishing this version creates an immutable record tied to template ID")} <code className="font-mono font-semibold">{template.id}</code>.
              </p>
            </div>

            {/* Version note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("Version Note / Changelog Summary")}
              </label>
              <input
                type="text"
                value={versionNote}
                onChange={(e) => setVersionNote(e.target.value)}
                placeholder={t("e.g. Updated financial classification accuracy and added Khmer intent support")}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            {/* Name & Key */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Template Name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value);
                    if (fieldErrors.templateName) {
                      setFieldErrors((prev) => ({ ...prev, templateName: [] }));
                    }
                  }}
                  className={`h-10 w-full rounded-2xl border bg-slate-50 px-3.5 text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D] ${
                    fieldErrors.templateName?.length
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-[#003377] dark:border-slate-800"
                  }`}
                  required
                />
                {fieldErrors.templateName?.[0] && (
                  <p className="text-[11px] font-medium text-red-500">
                    {fieldErrors.templateName[0]}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("Template Key")} <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    a-z, 0-9, ., _, -
                  </span>
                </div>
                <input
                  type="text"
                  value={templateKey}
                  onChange={(e) => {
                    setTemplateKey(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "-"));
                    if (fieldErrors.templateKey) {
                      setFieldErrors((prev) => ({ ...prev, templateKey: [] }));
                    }
                  }}
                  placeholder="financial-assistant-category-prediction"
                  className={`h-10 w-full rounded-2xl border bg-slate-50 px-3.5 font-mono text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D] ${
                    fieldErrors.templateKey?.length
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-[#003377] dark:border-slate-800"
                  }`}
                  required
                />
                {fieldErrors.templateKey?.[0] ? (
                  <p className="text-[11px] font-medium text-red-500">
                    {fieldErrors.templateKey[0]}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {t("Lowercase letters, numbers, '.', '_' and '-' only (no uppercase or spaces).")}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("Description")}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("Classifies a user's message into the appropriate iStash financial assistant category.")}
                className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
              />
            </div>

            {/* Scope, Task, Language, Status */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Task Type")}
                </label>
                <Select value={taskType} onValueChange={(val) => setTaskType(val as TaskType)}>
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="CATEGORY_PREDICTION">{t("Category Prediction")}</SelectItem>
                    <SelectItem value="FINANCIAL_ASSISTANT">{t("Financial Assistant")}</SelectItem>
                    <SelectItem value="SAVINGS_GOAL_ANALYSIS">{t("Savings Goal Analysis")}</SelectItem>
                    <SelectItem value="BUDGET_ADVICE">{t("Budget Advice")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Template Scope")}
                </label>
                <Select value={templateScope} onValueChange={(val) => setTemplateScope(val as TemplateScope)}>
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="GENERAL_CONVERSATION">{t("General Conversation")}</SelectItem>
                    <SelectItem value="SAVINGS_ANALYSIS">{t("Savings Analysis")}</SelectItem>
                    <SelectItem value="SPENDING_ANALYSIS">{t("Spending Analysis")}</SelectItem>
                    <SelectItem value="INCOME_ANALYSIS">{t("Income Analysis")}</SelectItem>
                    <SelectItem value="GENERAL_QUESTION">{t("General Question")}</SelectItem>
                    <SelectItem value="MONTHLY_SUMMARY">{t("Monthly Summary")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Language")}
                </label>
                <Select value={languageCode} onValueChange={(val) => setLanguageCode(val as LanguageCode)}>
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="km">{t("Khmer (km)")}</SelectItem>
                    <SelectItem value="en">{t("English (en)")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Initial Status")}
                </label>
                <Select value={templateStatus} onValueChange={(val) => setTemplateStatus(val as PromptTemplateStatus)}>
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="DRAFT">{t("Draft")}</SelectItem>
                    <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Model & Config */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Model Name")}
                </label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemini-2.5-flash"
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Temperature")} ({temperature})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Response MIME Type")}
                </label>
                <input
                  type="text"
                  value={responseMimeType}
                  onChange={(e) => setResponseMimeType(e.target.value)}
                  placeholder="application/json"
                  className="h-10 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("System Prompt")} <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {t("Defines role, classification rules, and response schema")}
                </span>
              </div>
              <textarea
                rows={7}
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  if (fieldErrors.systemPrompt) {
                    setFieldErrors((prev) => ({ ...prev, systemPrompt: [] }));
                  }
                }}
                className={`w-full rounded-2xl border bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                  fieldErrors.systemPrompt?.length
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                }`}
                required
              />
              {fieldErrors.systemPrompt?.[0] && (
                <p className="text-[11px] font-medium text-red-500">
                  {fieldErrors.systemPrompt[0]}
                </p>
              )}
            </div>

            {/* User Prompt Template */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("User Prompt Template")} <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {t("Supports variables like")} <code className="font-mono font-semibold text-[#003377] dark:text-[#FFC83D]">{"{{question}}"}</code>
                </span>
              </div>
              <textarea
                rows={5}
                value={userPromptTemplate}
                onChange={(e) => {
                  setUserPromptTemplate(e.target.value);
                  if (fieldErrors.userPromptTemplate) {
                    setFieldErrors((prev) => ({ ...prev, userPromptTemplate: [] }));
                  }
                }}
                className={`w-full rounded-2xl border bg-slate-50 p-3.5 font-mono text-xs leading-relaxed text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                  fieldErrors.userPromptTemplate?.length
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                }`}
                required
              />
              {fieldErrors.userPromptTemplate?.[0] && (
                <p className="text-[11px] font-medium text-red-500">
                  {fieldErrors.userPromptTemplate[0]}
                </p>
              )}
            </div>

            {/* Default toggle */}
            <label className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#003377] focus:ring-[#003377]"
              />
              <span className="font-semibold">{t("Make this new version the default version immediately")}</span>
            </label>

            {/* Advanced Schemas Collapsible */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex w-full items-center justify-between p-4 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                <span className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#003377] dark:text-[#FFC83D]" />
                  {t("Advanced JSON Schemas (Input Schema & Output Schema)")}
                </span>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {showAdvanced && (
                <div className="space-y-4 border-t border-slate-200 p-4 dark:border-slate-800">
                  {schemaError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                      {schemaError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Input Schema (JSON)")}
                    </label>
                    <textarea
                      rows={5}
                      value={inputSchemaJson}
                      onChange={(e) => setInputSchemaJson(e.target.value)}
                      placeholder='{ "type": "OBJECT", "properties": { "question": { "type": "STRING" } } }'
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Output Schema (JSON)")}
                    </label>
                    <textarea
                      rows={5}
                      value={outputSchemaJson}
                      onChange={(e) => setOutputSchemaJson(e.target.value)}
                      placeholder='{ "type": "OBJECT", "properties": { "predictedCategory": { "type": "STRING" } } }'
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs text-slate-800 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
              >
                {t("Cancel")}
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow-md shadow-[#FFC83D]/15 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg active:scale-95 active:bg-[#003377] active:text-[#FFC83D] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
              >
                {isCreating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                {isCreating ? t("Publishing Version...") : t("Publish Version")}
              </button>
            </div>
          </form>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
