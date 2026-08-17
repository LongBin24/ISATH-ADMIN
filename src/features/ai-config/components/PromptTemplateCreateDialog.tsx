"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, AlertCircle, ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import {
  useCreatePromptTemplateMutation,
  useUpdatePromptTemplateMutation,
} from "../api";
import { promptTemplateSchema, type PromptTemplateFormData } from "../schemas";
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
    }
    setErrorMsg(null);
    setSchemaError(null);
  }, [templateToEdit, isOpen]);

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
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D]">
              {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white">
                {isEditing ? t("Edit Prompt Template") : t("Create Prompt Template")}
              </DialogTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? t("Update configuration, schemas, or prompt instructions.")
                  : t("Register a new system/user prompt template (POST /api/v1/admin/ai/prompt-templates).")}
              </p>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {schemaError && (
          <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{schemaError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Row 1: Name and Key */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Template Name")} *
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
                className={`h-10 w-full rounded-xl border bg-slate-50 px-3 text-xs text-slate-800 focus:bg-white focus:outline-none dark:bg-slate-900 dark:text-slate-200 ${
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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("Template Key")} *
                </label>
                <span className="text-[10px] text-slate-400">
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
                className={`h-10 w-full rounded-xl border bg-slate-50 px-3 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none dark:bg-slate-900 dark:text-slate-200 ${
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
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          {/* Row 2: Selects for TaskType, Scope, Language, Status */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Task Type")}
              </label>
              <Select value={taskType} onValueChange={(val) => setTaskType(val as TaskType)}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CATEGORY_PREDICTION">CATEGORY_PREDICTION</SelectItem>
                  <SelectItem value="FINANCIAL_ASSISTANT">FINANCIAL_ASSISTANT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Scope")}
              </label>
              <Select value={templateScope} onValueChange={(val) => setTemplateScope(val as TemplateScope)}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL_CONVERSATION">GENERAL_CONVERSATION</SelectItem>
                  <SelectItem value="SAVINGS_ANALYSIS">SAVINGS_ANALYSIS</SelectItem>
                  <SelectItem value="SPENDING_ANALYSIS">SPENDING_ANALYSIS</SelectItem>
                  <SelectItem value="INCOME_ANALYSIS">INCOME_ANALYSIS</SelectItem>
                  <SelectItem value="BUDGET_ANALYSIS">BUDGET_ANALYSIS</SelectItem>
                  <SelectItem value="GENERAL_QUESTION">GENERAL_QUESTION</SelectItem>
                  <SelectItem value="MONTHLY_SUMMARY">MONTHLY_SUMMARY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Language")}
              </label>
              <Select value={languageCode} onValueChange={(val) => setLanguageCode(val as LanguageCode)}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">🇬🇧 English (en)</SelectItem>
                  <SelectItem value="km">🇰🇭 Khmer (km)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Status")}
              </label>
              <Select value={templateStatus} onValueChange={(val) => setTemplateStatus(val as PromptTemplateStatus)}>
                <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Model Name & Generation Config */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Model Name")}
              </label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                placeholder="gemini-2.5-flash"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t("Temperature")} ({temperature})
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
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
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t("System Prompt")} *
            </label>
            <textarea
              rows={5}
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                if (fieldErrors.systemPrompt) {
                  setFieldErrors((prev) => ({ ...prev, systemPrompt: [] }));
                }
              }}
              className={`w-full rounded-xl border bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 focus:bg-white focus:outline-none dark:bg-slate-900 dark:text-slate-200 ${
                fieldErrors.systemPrompt?.length
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#003377] dark:border-slate-800"
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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t("User Prompt Template")} *
            </label>
            <textarea
              rows={4}
              value={userPromptTemplate}
              onChange={(e) => {
                setUserPromptTemplate(e.target.value);
                if (fieldErrors.userPromptTemplate) {
                  setFieldErrors((prev) => ({ ...prev, userPromptTemplate: [] }));
                }
              }}
              className={`w-full rounded-xl border bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 focus:bg-white focus:outline-none dark:bg-slate-900 dark:text-slate-200 ${
                fieldErrors.userPromptTemplate?.length
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-[#003377] dark:border-slate-800"
              }`}
              required
            />
            {fieldErrors.userPromptTemplate?.[0] && (
              <p className="text-[11px] font-medium text-red-500">
                {fieldErrors.userPromptTemplate[0]}
              </p>
            )}
          </div>

          {/* Advanced JSON Schemas Accordion */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-[#003377] dark:text-[#FFC83D]" />
                {t("Input & Output JSON Schemas")}
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 focus:border-[#003377] focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
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
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-[11px] leading-relaxed text-slate-800 focus:border-[#003377] focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#003377] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#002255] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
            >
              {isLoading ? t("Saving...") : isEditing ? t("Update Template") : t("Create Template")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
