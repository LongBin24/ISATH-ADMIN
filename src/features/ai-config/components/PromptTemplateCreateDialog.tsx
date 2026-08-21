"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Edit,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Code2,
  Sparkles,
  Sliders,
  Bot,
  FileText,
  X,
} from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  useCreatePromptTemplateMutation,
  useUpdatePromptTemplateMutation,
} from "../api";
import { promptTemplateSchema } from "../schemas";
import type {
  PromptTemplateItem,
  TaskType,
  TemplateScope,
  LanguageCode,
  PromptTemplateStatus,
  JsonSchema,
} from "../types";

interface PromptTemplateCreateDialogProps {
  templateToEdit: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PromptTemplateCreateDialog({
  templateToEdit,
  isOpen,
  onClose,
  onSuccess,
}: PromptTemplateCreateDialogProps) {
  const { t } = useAdminI18n();
  const isEditing = Boolean(templateToEdit);

  const [templateKey, setTemplateKey] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("CATEGORY_PREDICTION");
  const [templateScope, setTemplateScope] = useState<TemplateScope>("GENERAL_CONVERSATION");
  const [languageCode, setLanguageCode] = useState<LanguageCode>("en");
  const [templateStatus, setTemplateStatus] = useState<PromptTemplateStatus>("DRAFT");
  const [isDefault, setIsDefault] = useState(false);
  const [modelName, setModelName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPromptTemplate, setUserPromptTemplate] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [responseMimeType, setResponseMimeType] = useState("application/json");

  // Advanced JSON schemas
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputSchemaJson, setInputSchemaJson] = useState("");
  const [outputSchemaJson, setOutputSchemaJson] = useState("");
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [createTemplate, { isLoading: isCreating }] = useCreatePromptTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdatePromptTemplateMutation();

  useEffect(() => {
    queueMicrotask(() => {
      if (templateToEdit) {
        setTemplateKey(templateToEdit.templateKey || "");
        setTemplateName(templateToEdit.templateName || templateToEdit.name || "");
        setDescription(templateToEdit.description || "");
        setTaskType(templateToEdit.taskType || "CATEGORY_PREDICTION");
        setTemplateScope(templateToEdit.templateScope || "GENERAL_CONVERSATION");
        setLanguageCode(templateToEdit.languageCode || "en");
        setTemplateStatus(templateToEdit.templateStatus || "DRAFT");
        setIsDefault(templateToEdit.isDefault ?? false);
        setModelName(templateToEdit.modelName || "");
        setSystemPrompt(templateToEdit.systemPrompt || "");
        setUserPromptTemplate(templateToEdit.userPromptTemplate || templateToEdit.template || "");

        const genConfig = templateToEdit.generationConfig as
          | { temperature?: number; responseMimeType?: string }
          | undefined;
        setTemperature(genConfig?.temperature ?? 0);
        setResponseMimeType(genConfig?.responseMimeType ?? "application/json");

        setInputSchemaJson(
          templateToEdit.inputSchema
            ? JSON.stringify(templateToEdit.inputSchema, null, 2)
            : ""
        );
        setOutputSchemaJson(
          templateToEdit.outputSchema
            ? JSON.stringify(templateToEdit.outputSchema, null, 2)
            : ""
        );
        setShowAdvanced(Boolean(templateToEdit.inputSchema || templateToEdit.outputSchema));
      } else {
        setTemplateKey("");
        setTemplateName("");
        setDescription("");
        setTaskType("CATEGORY_PREDICTION");
        setTemplateScope("GENERAL_CONVERSATION");
        setLanguageCode("en");
        setTemplateStatus("DRAFT");
        setIsDefault(false);
        setModelName("gemini-2.5-flash");
        setTemperature(0);
        setResponseMimeType("application/json");
        setSystemPrompt("");
        setUserPromptTemplate("");
        setInputSchemaJson("");
        setOutputSchemaJson("");
        setShowAdvanced(false);
      }
      setErrorMsg(null);
      setSchemaError(null);
      setFieldErrors({});
    });
  }, [templateToEdit, isOpen]);

  function loadSampleTemplate() {
    setTemplateKey("istash-financial-intent-classifier");
    setTemplateName("iStash Financial Assistant - Intent Classification");
    setDescription(
      "Classifies user messages into a single predefined iStash financial assistant intent for downstream routing."
    );
    setTaskType("CATEGORY_PREDICTION");
    setTemplateScope("GENERAL_CONVERSATION");
    setLanguageCode("en");
    setTemplateStatus("DRAFT");
    setIsDefault(false);
    setModelName("gemini-2.5-flash");
    setTemperature(0);
    setResponseMimeType("application/json");
    setSystemPrompt(
      "You are the intent classification engine for the iStash Financial Assistant. Your only task is to identify the user's primary intent and classify the message into exactly one of the predefined categories. Always return valid JSON."
    );
    setUserPromptTemplate(
      "Classify the user's message into exactly one iStash financial assistant category.\n\nUSER MESSAGE:\n{{question}}\n\nReturn only a JSON object containing the predicted category."
    );
    setInputSchemaJson(
      JSON.stringify(
        {
          type: "object",
          required: ["question"],
          properties: {
            question: {
              type: "string",
              description: "The user's message to classify.",
              minLength: 1,
            },
          },
          additionalProperties: false,
        },
        null,
        2
      )
    );
    setOutputSchemaJson(
      JSON.stringify(
        {
          type: "object",
          required: ["category"],
          properties: {
            category: {
              type: "string",
              description: "The single predicted iStash financial assistant intent.",
              enum: [
                "GENERAL_QUESTION",
                "BALANCE",
                "TRANSACTION",
                "EXPENSE",
                "INCOME",
                "BUDGET",
                "SAVINGS_GOAL",
                "TRANSFER",
                "GENERAL_CONVERSATION",
              ],
            },
          },
          additionalProperties: false,
        },
        null,
        2
      )
    );
    setShowAdvanced(true);
    setErrorMsg(null);
    setSchemaError(null);
    setFieldErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSchemaError(null);
    setFieldErrors({});

    let parsedInputSchema: JsonSchema | null = null;
    let parsedOutputSchema: JsonSchema | null = null;

    if (inputSchemaJson.trim()) {
      try {
        parsedInputSchema = JSON.parse(inputSchemaJson);
      } catch {
        setSchemaError(t("Invalid JSON in Input Schema"));
        return;
      }
    }

    if (outputSchemaJson.trim()) {
      try {
        parsedOutputSchema = JSON.parse(outputSchemaJson);
      } catch {
        setSchemaError(t("Invalid JSON in Output Schema"));
        return;
      }
    }

    const formValues = {
      templateKey: templateKey.trim().toLowerCase(),
      templateName: templateName.trim(),
      description: description?.trim() || null,
      taskType,
      templateScope: templateScope || null,
      languageCode,
      templateStatus,
      isDefault,
      modelName: modelName?.trim() || null,
      systemPrompt: systemPrompt.trim(),
      userPromptTemplate: userPromptTemplate.trim(),
      temperature,
      responseMimeType,
      inputSchemaJson: inputSchemaJson.trim() || undefined,
      outputSchemaJson: outputSchemaJson.trim() || undefined,
    };

    const zodResult = promptTemplateSchema.safeParse(formValues);

    if (!zodResult.success) {
      const flattened = zodResult.error.flatten();
      setFieldErrors(flattened.fieldErrors as Record<string, string[]>);
      const firstIssue = zodResult.error.issues[0]?.message || t("Please correct the form errors.");
      setErrorMsg(firstIssue);
      return;
    }

    const payload = {
      templateKey: formValues.templateKey,
      templateName: formValues.templateName,
      description: formValues.description,
      taskType: formValues.taskType,
      templateScope: formValues.templateScope,
      languageCode: formValues.languageCode,
      templateStatus: formValues.templateStatus,
      isDefault: formValues.isDefault,
      modelName: formValues.modelName,
      systemPrompt: formValues.systemPrompt,
      userPromptTemplate: formValues.userPromptTemplate,
      inputSchema: parsedInputSchema,
      outputSchema: parsedOutputSchema,
      generationConfig: {
        temperature: formValues.temperature,
        responseMimeType: formValues.responseMimeType,
      },
    };

    try {
      if (isEditing && templateToEdit) {
        await updateTemplate({
          templateId: templateToEdit.id,
          body: payload,
        }).unwrap();
      } else {
        await createTemplate(payload).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const data = (err as { data: Record<string, unknown> }).data;
        if (Array.isArray(data?.fieldErrors) && data.fieldErrors.length > 0) {
          const formattedErrors = data.fieldErrors
            .map(
              (f: { field?: string; message?: string }) =>
                `${f.field ? `[${f.field}] ` : ""}${f.message}`
            )
            .join(" | ");
          setErrorMsg(formattedErrors);
          return;
        }
        if (typeof data?.message === "string") {
          setErrorMsg(data.message);
          return;
        }
      }
      setErrorMsg(t("Failed to save prompt template. Please check all required fields."));
    }
  }

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col overflow-hidden rounded-3xl p-0 font-google-sans border-border">
        {/* Fixed Modal Header */}
        <DialogHeader className="relative shrink-0 border-b border-slate-100 bg-white/95 px-6 py-4.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-8 sm:py-5 z-10">
          <div className="flex items-center justify-between gap-3 pr-11 sm:pr-12">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D] shadow-sm">
                {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-[#FFC83D] sm:text-2xl">
                  {isEditing ? t("Edit Prompt Template") : t("Create Prompt Template")}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isEditing
                    ? t("Update configuration, schemas, or prompt instructions.")
                    : t("Register a new system/user prompt template (POST /api/v1/admin/ai/prompt-templates).")}
                </p>
              </div>
            </div>
          </div>

          {/* Absolute Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            title={t("Close")}
            className="absolute top-4 right-4 sm:top-5 sm:right-6 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-100/80 text-slate-600 shadow-sm transition-all duration-150 hover:bg-slate-200 hover:border-[#FFC83D] hover:text-[#003377] active:scale-90 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-5">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {schemaError && (
              <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{schemaError}</span>
              </div>
            )}
          {/* Section 1: Basic Information */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>{t("Basic Information")}</span>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={loadSampleTemplate}
                  className="text-[11px] font-semibold text-slate-500 hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D] underline underline-offset-2 transition-colors active:scale-95"
                >
                  {t("Load Example Template")}
                </button>
              )}
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                  placeholder="iStash Financial Assistant - Intent Classification"
                  className={`h-10 w-full rounded-xl border bg-slate-50/60 px-3.5 text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                    fieldErrors.templateName?.length
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
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
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("Template Key")} <span className="text-red-500">*</span>
                  </label>
                  <span className="font-mono text-[10px] text-slate-400">
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
                  placeholder="istash-financial-intent-classifier"
                  className={`h-10 w-full rounded-xl border bg-slate-50/60 px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                    fieldErrors.templateKey?.length
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                  }`}
                  required
                />
                {fieldErrors.templateKey?.[0] ? (
                  <p className="text-[11px] font-medium text-red-500">
                    {fieldErrors.templateKey[0]}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {t("Lowercase letters, numbers, '.', '_' and '-' only (e.g. istash-intent-v1)")}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Description")}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("Classifies user messages into predefined intents...")}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
              />
            </div>
          </div>

          {/* Section 2: Scope & Classification */}
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
                <Select value={taskType} onValueChange={(val) => setTaskType(val as TaskType)}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/60 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-950 dark:data-[state=open]:border-[#FFC83D]">
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Scope")}
                </label>
                <Select value={templateScope} onValueChange={(val) => setTemplateScope(val as TemplateScope)}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/60 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-950 dark:data-[state=open]:border-[#FFC83D]">
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
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Language")}
                </label>
                <Select value={languageCode} onValueChange={(val) => setLanguageCode(val as LanguageCode)}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/60 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-950 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="en">{t("English (en)")}</SelectItem>
                    <SelectItem value="km">{t("Khmer (km)")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Status")}
                </label>
                <Select value={templateStatus} onValueChange={(val) => setTemplateStatus(val as PromptTemplateStatus)}>
                  <SelectTrigger className="h-10 rounded-xl bg-slate-50/60 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-[#003377] hover:bg-[#003377]/5 hover:text-[#003377] hover:[&>svg]:text-[#003377] active:scale-95 focus:bg-white focus:border-[#003377] focus:ring-4 focus:ring-[#003377]/10 data-[state=open]:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D]/10 dark:hover:text-[#FFC83D] dark:hover:[&>svg]:text-[#FFC83D] dark:focus:bg-slate-950 dark:focus:border-[#FFC83D] dark:focus:ring-4 dark:focus:ring-[#FFC83D]/15 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-950 dark:data-[state=open]:border-[#FFC83D]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="DRAFT">{t("Draft")}</SelectItem>
                    <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
                    <SelectItem value="ARCHIVED">{t("Archived")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Model & Parameters */}
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
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="gemini-2.5-flash"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("Temperature")}
                  </label>
                  <span className="font-mono text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                    {temperature}
                  </span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Response MIME Type")}
                </label>
                <input
                  type="text"
                  value={responseMimeType}
                  onChange={(e) => setResponseMimeType(e.target.value)}
                  placeholder="application/json"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 font-mono text-xs text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Prompt Instructions */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
              <FileText className="h-4 w-4" />
              <span>{t("Prompt Instructions")}</span>
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("System Prompt")} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {t("Defines the AI assistant persona, rules, and output format.")}
                </span>
              </div>
              <textarea
                rows={5}
                value={systemPrompt}
                onChange={(e) => {
                  setSystemPrompt(e.target.value);
                  if (fieldErrors.systemPrompt) {
                    setFieldErrors((prev) => ({ ...prev, systemPrompt: [] }));
                  }
                }}
                className={`w-full rounded-xl border bg-slate-50/60 p-3.5 font-mono text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("User Prompt Template")} <span className="text-red-500">*</span>
                </label>
                <span className="font-mono text-[10px] text-[#003377] dark:text-[#FFC83D]">
                  {t("Supported variable syntax:")} {"{{question}}"}
                </span>
              </div>
              <textarea
                rows={4}
                value={userPromptTemplate}
                onChange={(e) => {
                  setUserPromptTemplate(e.target.value);
                  if (fieldErrors.userPromptTemplate) {
                    setFieldErrors((prev) => ({ ...prev, userPromptTemplate: [] }));
                  }
                }}
                className={`w-full rounded-xl border bg-slate-50/60 p-3.5 font-mono text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
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
          </div>

          {/* Section 5: Advanced JSON Schemas Accordion */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50 transition-all duration-200">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-xs font-bold text-slate-700 transition-all duration-150 hover:text-[#003377] active:scale-[0.99] dark:text-slate-300 dark:hover:text-[#FFC83D]"
            >
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#003377] dark:text-[#FFC83D]" />
                <span>{t("Input & Output JSON Schemas")}</span>
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {t("Input Schema (JSON)")}
                  </label>
                  <textarea
                    rows={8}
                    value={inputSchemaJson}
                    onChange={(e) => {
                      setInputSchemaJson(e.target.value);
                      setSchemaError(null);
                    }}
                    placeholder='{"type": "object", "required": ["question"]}'
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {t("Output Schema (JSON)")}
                  </label>
                  <textarea
                    rows={8}
                    value={outputSchemaJson}
                    onChange={(e) => {
                      setOutputSchemaJson(e.target.value);
                      setSchemaError(null);
                    }}
                    placeholder='{"type": "object", "required": ["category"]}'
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] focus:border-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:focus:border-[#FFC83D]"
                  />
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="shrink-0 flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow-md shadow-[#FFC83D]/10 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg active:scale-95 active:bg-[#003377] active:text-[#FFC83D] active:shadow-inner disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
            >
              {isLoading ? t("Saving...") : isEditing ? t("Update Template") : t("Create Template")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
