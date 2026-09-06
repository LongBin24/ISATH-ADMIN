"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Bot,
  Sliders,
  RotateCcw,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { LanguageFlag } from "@/components/ui/LanguageFlag";
import {
  useGetPromptTemplateVersionsQuery,
  useCreatePromptTemplateVersionMutation,
  useSetDefaultPromptTemplateMutation,
} from "../api";
import { promptTemplateVersionSchema, type PromptTemplateVersionFormData } from "../schemas";
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

const MODEL_PRESETS = [
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "claude-3-5-sonnet",
];

const MIME_PRESETS = ["application/json", "text/plain"];

const TEMPLATE_VARIABLES = ["{{question}}", "{{financialContext}}", "{{currencyCode}}"];

const defaultVersionValues: PromptTemplateVersionFormData = {
  templateKey: "",
  templateName: "",
  description: "",
  taskType: "CATEGORY_PREDICTION",
  templateScope: "GENERAL_CONVERSATION",
  languageCode: "en",
  templateStatus: "DRAFT",
  isDefault: false,
  modelName: "gemini-2.5-flash",
  temperature: 0.3,
  responseMimeType: "application/json",
  systemPrompt: "",
  userPromptTemplate: "",
  versionNote: "",
  inputSchemaJson: "",
  outputSchemaJson: "",
};

export function PromptTemplateVersionHistoryDialog({
  template,
  isOpen,
  onClose,
}: PromptTemplateVersionHistoryDialogProps) {
  const { t } = useAdminI18n();
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PromptTemplateVersionFormData>({
    resolver: zodResolver(promptTemplateVersionSchema),
    defaultValues: defaultVersionValues,
  });

  const templateKey = useWatch({ control, name: "templateKey" }) ?? "";
  const taskType = useWatch({ control, name: "taskType" }) ?? "CATEGORY_PREDICTION";
  const templateScope = useWatch({ control, name: "templateScope" }) ?? "GENERAL_CONVERSATION";
  const languageCode = useWatch({ control, name: "languageCode" }) ?? "en";
  const templateStatus = useWatch({ control, name: "templateStatus" }) ?? "DRAFT";
  const isDefault = useWatch({ control, name: "isDefault" }) ?? false;
  const modelName = useWatch({ control, name: "modelName" }) ?? "gemini-2.5-flash";
  const temperature = useWatch({ control, name: "temperature" }) ?? 0.3;
  const responseMimeType = useWatch({ control, name: "responseMimeType" }) ?? "application/json";
  const systemPrompt = useWatch({ control, name: "systemPrompt" }) ?? "";
  const userPromptTemplate = useWatch({ control, name: "userPromptTemplate" }) ?? "";
  const inputSchemaJson = (useWatch({ control, name: "inputSchemaJson" }) as string) ?? "";
  const outputSchemaJson = (useWatch({ control, name: "outputSchemaJson" }) as string) ?? "";

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

  const populateFormFromSource = useCallback(
    (source: PromptTemplateItem | PromptTemplateVersion) => {
      const raw = source as Record<string, unknown>;
      const inSchema = source.inputSchema
        ? JSON.stringify(source.inputSchema, null, 2)
        : "";
      const outSchema = source.outputSchema
        ? JSON.stringify(source.outputSchema, null, 2)
        : "";

      const genConfig = source.generationConfig as
        | { temperature?: number; responseMimeType?: string }
        | undefined;

      reset({
        templateKey: source.templateKey || template?.templateKey || "",
        templateName:
          source.templateName || (typeof raw.name === "string" ? raw.name : "") || template?.templateName || "",
        description: source.description || "",
        taskType: (source.taskType as TaskType) || "CATEGORY_PREDICTION",
        templateScope: (source.templateScope as TemplateScope) || "GENERAL_CONVERSATION",
        languageCode: (source.languageCode as LanguageCode) || "en",
        templateStatus: (source.templateStatus as PromptTemplateStatus) || "DRAFT",
        isDefault: Boolean(source.isDefault),
        modelName: source.modelName || "gemini-2.5-flash",
        systemPrompt: source.systemPrompt || "",
        userPromptTemplate:
          source.userPromptTemplate || (typeof raw.template === "string" ? raw.template : "") || "",
        versionNote:
          (typeof source.versionNote === "string" ? source.versionNote : "") ||
          (typeof raw.notes === "string" ? raw.notes : "") ||
          (typeof raw.changelog === "string" ? raw.changelog : "") ||
          "",
        temperature: typeof genConfig?.temperature === "number" ? genConfig.temperature : 0.3,
        responseMimeType: typeof genConfig?.responseMimeType === "string" ? genConfig.responseMimeType : "application/json",
        inputSchemaJson: inSchema,
        outputSchemaJson: outSchema,
      });
      setShowAdvanced(Boolean(inSchema || outSchema));
    },
    [template, reset]
  );

  useEffect(() => {
    if (template && isOpen) {
      queueMicrotask(() => {
        populateFormFromSource(template);
        setSuccessMsg(null);
        setErrorMsg(null);
      });
    }
  }, [template, isOpen, populateFormFromSource]);

  if (!template) return null;

  function formatInputSchema() {
    if (!inputSchemaJson || typeof inputSchemaJson !== "string" || !inputSchemaJson.trim()) return;
    try {
      const parsed = JSON.parse(inputSchemaJson);
      setValue("inputSchemaJson", JSON.stringify(parsed, null, 2), { shouldValidate: true });
    } catch {
      // Handled by validation
    }
  }

  function formatOutputSchema() {
    if (!outputSchemaJson || typeof outputSchemaJson !== "string" || !outputSchemaJson.trim()) return;
    try {
      const parsed = JSON.parse(outputSchemaJson);
      setValue("outputSchemaJson", JSON.stringify(parsed, null, 2), { shouldValidate: true });
    } catch {
      // Handled by validation
    }
  }

  function insertVariable(variableName: string) {
    const current = userPromptTemplate || "";
    if (current.includes(variableName)) return;
    const updated = current ? `${current}\n${variableName}` : variableName;
    setValue("userPromptTemplate", updated, { shouldValidate: true });
  }

  function copyPromptToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(key);
    setTimeout(() => setCopiedPrompt(null), 1800);
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function validateJsonSyntax(jsonStr?: string | unknown): { valid: boolean; error?: string } {
    if (!jsonStr || typeof jsonStr !== "string" || !jsonStr.trim()) return { valid: true };
    try {
      JSON.parse(jsonStr);
      return { valid: true };
    } catch (e: unknown) {
      return { valid: false, error: e instanceof Error ? e.message : "Syntax error" };
    }
  }

  const inputJsonCheck = validateJsonSyntax(inputSchemaJson);
  const outputJsonCheck = validateJsonSyntax(outputSchemaJson);
  const hasSchemasConfigured = Boolean(
    (typeof inputSchemaJson === "string" && inputSchemaJson.trim()) ||
    (typeof outputSchemaJson === "string" && outputSchemaJson.trim())
  );

  function handleCloneVersion(ver: PromptTemplateVersion) {
    populateFormFromSource(ver);
    setValue("versionNote", `Cloned from version v${ver.version || ver.versionNumber || "prev"}`);
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

  async function onSubmit(formValues: PromptTemplateVersionFormData) {
    if (!template) return;

    setSuccessMsg(null);
    setErrorMsg(null);

    let parsedInputSchema: JsonSchema | null = null;
    let parsedOutputSchema: JsonSchema | null = null;

    if (
      typeof formValues.inputSchemaJson === "string" &&
      formValues.inputSchemaJson.trim()
    ) {
      try {
        parsedInputSchema = JSON.parse(formValues.inputSchemaJson);
      } catch {
        return;
      }
    } else if (typeof formValues.inputSchemaJson === "object" && formValues.inputSchemaJson !== null) {
      parsedInputSchema = formValues.inputSchemaJson as JsonSchema;
    }

    if (
      typeof formValues.outputSchemaJson === "string" &&
      formValues.outputSchemaJson.trim()
    ) {
      try {
        parsedOutputSchema = JSON.parse(formValues.outputSchemaJson);
      } catch {
        return;
      }
    } else if (typeof formValues.outputSchemaJson === "object" && formValues.outputSchemaJson !== null) {
      parsedOutputSchema = formValues.outputSchemaJson as JsonSchema;
    }

    try {
      const payload = {
        templateKey: formValues.templateKey.trim().toLowerCase(),
        templateName: formValues.templateName.trim(),
        description: formValues.description?.trim() || null,
        taskType: formValues.taskType,
        templateScope: formValues.templateScope || null,
        languageCode: formValues.languageCode,
        systemPrompt: formValues.systemPrompt.trim(),
        userPromptTemplate: formValues.userPromptTemplate.trim(),
        inputSchema: parsedInputSchema,
        outputSchema: parsedOutputSchema,
        modelName: formValues.modelName?.trim() || "gemini-2.5-flash",
        generationConfig: {
          temperature: formValues.temperature,
          responseMimeType: formValues.responseMimeType,
        },
        templateStatus: formValues.templateStatus,
        isDefault: formValues.isDefault,
        versionNote: formValues.versionNote?.trim() || null,
      };

      await createVersion({
        templateId: template.id,
        body: payload,
      }).unwrap();

      setSuccessMsg(
        t("New prompt template version created successfully (POST /api/v1/admin/ai/prompt-templates/{templateId}/versions).")
      );
      setValue("versionNote", "");
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
    if (!val) return "N/A";
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
                              className="rounded-full border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300 inline-flex items-center gap-1.5"
                            >
                              <LanguageFlag locale={ver.languageCode} className="w-3.5 h-2.5" />
                              <span>{isKhmer ? t("Khmer (km)") : t("English (en)")}</span>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                  <Sparkles className="h-4 w-4" />
                  <span>{t("POST /api/v1/admin/ai/prompt-templates/{templateId}/versions")}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {t("Publishing this version creates an immutable record tied to template ID")}{" "}
                  <code className="font-mono font-semibold text-[#003377] dark:text-[#FFC83D]">{template.id}</code>.
                </p>
              </div>

              {/* Version Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("Version Note / Changelog Summary")}
                </label>
                <input
                  type="text"
                  {...register("versionNote")}
                  placeholder={t("e.g. Updated financial classification accuracy and added Khmer intent support")}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
                {errors.versionNote?.message && (
                  <p className="text-[11px] font-medium text-red-500">{errors.versionNote.message}</p>
                )}
              </div>

              {/* Section 1: Basic Information */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Template Name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("templateName")}
                      className={`h-10 w-full rounded-xl border bg-white px-3.5 text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                        errors.templateName
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                      }`}
                    />
                    {errors.templateName?.message && (
                      <p className="text-[11px] font-medium text-red-500">
                        {errors.templateName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                        const cleaned = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9._-]/g, "-");
                        setValue("templateKey", cleaned, { shouldValidate: true });
                      }}
                      placeholder="financial-assistant-category-prediction"
                      className={`h-10 w-full rounded-xl border bg-white px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                        errors.templateKey
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                      }`}
                    />
                    {errors.templateKey?.message ? (
                      <p className="text-[11px] font-medium text-red-500">
                        {errors.templateKey.message}
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {t("Lowercase letters, numbers, '.', '_' and '-' only.")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("Description")}
                  </label>
                  <textarea
                    rows={2}
                    {...register("description")}
                    placeholder={t("Classifies a user's message into the appropriate iStash financial assistant category.")}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                  />
                  {errors.description?.message && (
                    <p className="text-[11px] font-medium text-red-500">{errors.description.message}</p>
                  )}
                </div>

                {/* Default toggle */}
                <label className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-xs text-slate-700 shadow-xs cursor-pointer transition hover:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D]">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setValue("isDefault", e.target.checked, { shouldValidate: true })}
                    className="h-4 w-4 rounded border-slate-300 text-[#003377] focus:ring-[#003377] dark:border-slate-700 dark:bg-slate-800"
                  />
                  <span className="font-semibold">{t("Make this new version the default version immediately")}</span>
                </label>
              </div>

              {/* Section 2: Scope, Task, Language, Status */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                  <Sliders className="h-4 w-4" />
                  <span>{t("Scope & Classification")}</span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Task Type")}
                    </label>
                    <Select
                      value={taskType}
                      onValueChange={(val) => setValue("taskType", val as TaskType, { shouldValidate: true })}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="CATEGORY_PREDICTION">{t("Category Prediction")}</SelectItem>
                        <SelectItem value="FINANCIAL_ASSISTANT">{t("Financial Assistant")}</SelectItem>
                        <SelectItem value="SAVINGS_GOAL_ANALYSIS">{t("Savings Goal Analysis")}</SelectItem>
                        <SelectItem value="BUDGET_ADVICE">{t("Budget Advice")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.taskType?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.taskType.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Template Scope")}
                    </label>
                    <Select
                      value={templateScope ?? "GENERAL_CONVERSATION"}
                      onValueChange={(val) => setValue("templateScope", val as TemplateScope, { shouldValidate: true })}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="GENERAL_CONVERSATION">{t("General Conversation")}</SelectItem>
                        <SelectItem value="SAVINGS_ANALYSIS">{t("Savings Analysis")}</SelectItem>
                        <SelectItem value="SPENDING_ANALYSIS">{t("Spending Analysis")}</SelectItem>
                        <SelectItem value="INCOME_ANALYSIS">{t("Income Analysis")}</SelectItem>
                        <SelectItem value="BUDGET_ANALYSIS">{t("Budget Analysis")}</SelectItem>
                        <SelectItem value="GENERAL_QUESTION">{t("General Question")}</SelectItem>
                        <SelectItem value="MONTHLY_SUMMARY">{t("Monthly Summary")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.templateScope?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.templateScope.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Language")}
                    </label>
                    <Select
                      value={languageCode}
                      onValueChange={(val) => setValue("languageCode", val as LanguageCode, { shouldValidate: true })}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 dark:data-[state=open]:border-[#FFC83D]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="km">
                          <div className="flex items-center gap-2">
                            <LanguageFlag locale="km" className="h-3.5 w-4" />
                            <span>{t("Khmer (km)")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="en">
                          <div className="flex items-center gap-2">
                            <LanguageFlag locale="en" className="h-3.5 w-4" />
                            <span>{t("English (en)")}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.languageCode?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.languageCode.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Initial Status")}
                    </label>
                    <Select
                      value={templateStatus}
                      onValueChange={(val) => setValue("templateStatus", val as PromptTemplateStatus, { shouldValidate: true })}
                    >
                      <SelectTrigger className="h-10 rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 data-[state=open]:border-[#FFC83D]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="ACTIVE">
                          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold dark:text-emerald-400">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {t("Active")}
                          </span>
                        </SelectItem>
                        <SelectItem value="DRAFT">
                          <span className="flex items-center gap-1.5 text-amber-600 font-semibold dark:text-amber-400">
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            {t("Draft")}
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.templateStatus?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.templateStatus.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Model & Config */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                  <Bot className="h-4 w-4" />
                  <span>{t("Model & Parameters")}</span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Model Name")}
                    </label>
                    <input
                      type="text"
                      {...register("modelName")}
                      placeholder="gemini-2.5-flash"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {MODEL_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setValue("modelName", preset, { shouldValidate: true })}
                          className={`rounded-lg px-2 py-0.5 font-mono text-[10px] transition ${
                            modelName === preset
                              ? "bg-[#003377] text-white font-bold dark:bg-[#FFC83D] dark:text-[#003377]"
                              : "bg-slate-200/70 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    {errors.modelName?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.modelName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t("Temperature")}
                      </label>
                      <span className="rounded-md bg-[#003377]/10 px-2 py-0.5 font-mono text-[11px] font-bold text-[#003377] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]">
                        {temperature.toFixed(1)} {temperature <= 0.2 ? `(${t("Precise")})` : temperature <= 0.7 ? `(${t("Balanced")})` : `(${t("Creative")})`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={temperature}
                        onChange={(e) =>
                          setValue("temperature", Number(e.target.value), { shouldValidate: true })
                        }
                        className="h-2 w-full cursor-pointer accent-[#003377] dark:accent-[#FFC83D]"
                      />
                      <input
                        type="number"
                        min={0}
                        max={2}
                        step={0.1}
                        value={temperature}
                        onChange={(e) =>
                          setValue(
                            "temperature",
                            Math.max(0, Math.min(2, Number(e.target.value))),
                            { shouldValidate: true }
                          )
                        }
                        className="h-9 w-16 rounded-xl border border-slate-200 bg-white px-2 text-center font-mono text-xs text-slate-800 shadow-sm focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-[#FFC83D]"
                      />
                    </div>
                    {errors.temperature?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.temperature.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Response MIME Type")}
                    </label>
                    <input
                      type="text"
                      {...register("responseMimeType")}
                      placeholder="application/json"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                    />
                    <div className="flex flex-wrap gap-1 pt-1">
                      {MIME_PRESETS.map((mime) => (
                        <button
                          key={mime}
                          type="button"
                          onClick={() => setValue("responseMimeType", mime, { shouldValidate: true })}
                          className={`rounded-lg px-2 py-0.5 font-mono text-[10px] transition ${
                            responseMimeType === mime
                              ? "bg-[#003377] text-white font-bold dark:bg-[#FFC83D] dark:text-[#003377]"
                              : "bg-slate-200/70 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {mime}
                        </button>
                      ))}
                    </div>
                    {errors.responseMimeType?.message && (
                      <p className="text-[11px] font-medium text-red-500">{errors.responseMimeType.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: System Prompt */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{t("Prompt Instructions")}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("System Prompt")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {systemPrompt.length} {t("chars")}
                      </span>
                      {systemPrompt && (
                        <button
                          type="button"
                          onClick={() => copyPromptToClipboard(systemPrompt, "sys")}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D] transition"
                        >
                          {copiedPrompt === "sys" ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedPrompt === "sys" ? t("Copied") : t("Copy")}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t("Defines role, classification rules, and response schema")}
                  </p>
                  <textarea
                    rows={6}
                    {...register("systemPrompt")}
                    className={`w-full rounded-xl border bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      errors.systemPrompt
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`}
                  />
                  {errors.systemPrompt?.message && (
                    <p className="text-[11px] font-medium text-red-500">
                      {errors.systemPrompt.message}
                    </p>
                  )}
                </div>

                {/* User Prompt Template */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("User Prompt Template")} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {userPromptTemplate.length} {t("chars")}
                      </span>
                      {userPromptTemplate && (
                        <button
                          type="button"
                          onClick={() => copyPromptToClipboard(userPromptTemplate, "usr")}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D] transition"
                        >
                          {copiedPrompt === "usr" ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedPrompt === "usr" ? t("Copied") : t("Copy")}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Variable insertion helpers */}
                  <div className="flex flex-wrap items-center gap-1.5 py-1">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {t("Supported variable syntax:")}
                    </span>
                    {TEMPLATE_VARIABLES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        title={t("Click to insert variable")}
                        className="inline-flex items-center gap-1 rounded-md border border-[#003377]/20 bg-[#003377]/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#003377] transition hover:bg-[#003377]/10 hover:border-[#003377] active:scale-95 dark:border-[#FFC83D]/30 dark:bg-[#FFC83D]/10 dark:text-[#FFC83D] dark:hover:bg-[#FFC83D]/20"
                      >
                        <span>{v}</span>
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={5}
                    {...register("userPromptTemplate")}
                    className={`w-full rounded-xl border bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      errors.userPromptTemplate
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`}
                  />
                  {errors.userPromptTemplate?.message && (
                    <p className="text-[11px] font-medium text-red-500">
                      {errors.userPromptTemplate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section 5: Advanced Schemas Collapsible */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 transition-all duration-200">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex w-full items-center justify-between text-xs font-bold text-slate-700 transition-all duration-150 hover:text-[#003377] active:scale-[0.99] dark:text-slate-300 dark:hover:text-[#FFC83D]"
                >
                  <span className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-[#003377] dark:text-[#FFC83D]" />
                    <span>{t("Input & Output JSON Schemas")}</span>
                    {hasSchemasConfigured && (
                      <Badge
                        variant="outline"
                        className="rounded-full border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
                      >
                        {t("Configured")}
                      </Badge>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-normal text-slate-400">
                      {showAdvanced ? t("Hide Schemas") : t("Show / Edit Schemas")}
                    </span>
                    {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {showAdvanced && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    {/* Input Schema */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {t("Input Schema (JSON)")}
                        </label>
                        <div className="flex items-center gap-2">
                          {typeof inputSchemaJson === "string" && inputSchemaJson.trim() && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                                inputJsonCheck.valid
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {inputJsonCheck.valid ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {inputJsonCheck.valid ? t("Valid JSON") : t("Invalid Syntax")}
                            </span>
                          )}
                          {typeof inputSchemaJson === "string" && inputSchemaJson.trim() && (
                            <button
                              type="button"
                              onClick={formatInputSchema}
                              title={t("Prettify JSON")}
                              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              {t("Prettify")}
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea
                        rows={6}
                        {...register("inputSchemaJson")}
                        placeholder='{ "type": "OBJECT", "properties": { "question": { "type": "STRING" } } }'
                        className={`w-full rounded-xl border bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                          errors.inputSchemaJson || (!inputJsonCheck.valid && inputSchemaJson.trim())
                            ? "border-amber-400 focus:border-amber-500"
                            : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                        }`}
                      />
                      {errors.inputSchemaJson?.message && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          {errors.inputSchemaJson.message}
                        </p>
                      )}
                    </div>

                    {/* Output Schema */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {t("Output Schema (JSON)")}
                        </label>
                        <div className="flex items-center gap-2">
                          {typeof outputSchemaJson === "string" && outputSchemaJson.trim() && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                                outputJsonCheck.valid
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {outputJsonCheck.valid ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertCircle className="h-3 w-3" />
                              )}
                              {outputJsonCheck.valid ? t("Valid JSON") : t("Invalid Syntax")}
                            </span>
                          )}
                          {typeof outputSchemaJson === "string" && outputSchemaJson.trim() && (
                            <button
                              type="button"
                              onClick={formatOutputSchema}
                              title={t("Prettify JSON")}
                              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
                            >
                              <RotateCcw className="h-2.5 w-2.5" />
                              {t("Prettify")}
                            </button>
                          )}
                        </div>
                      </div>
                      <textarea
                        rows={6}
                        {...register("outputSchemaJson")}
                        placeholder='{ "type": "OBJECT", "properties": { "predictedCategory": { "type": "STRING" } } }'
                        className={`w-full rounded-xl border bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                          errors.outputSchemaJson || (!outputJsonCheck.valid && outputSchemaJson.trim())
                            ? "border-amber-400 focus:border-amber-500"
                            : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                        }`}
                      />
                      {errors.outputSchemaJson?.message && (
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          {errors.outputSchemaJson.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                >
                  {t("Cancel")}
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow-md shadow-[#FFC83D]/15 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg active:scale-95 active:bg-[#003377] active:text-[#FFC83D] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
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
