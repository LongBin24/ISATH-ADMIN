"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, AlertCircle, Zap, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useTestPromptTemplateMutation } from "../api";
import type {
  JsonSchema,
  JsonSchemaProperty,
  LanguageCode,
  PromptTemplateItem,
  TestPromptTemplatePayload,
  TestPromptTemplateResponse,
} from "../types";

interface PromptTemplateTestDialogProps {
  template: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type FieldKind = "string" | "number" | "boolean" | "enum" | "json";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getInputSchemaProperties(
  template: PromptTemplateItem | null,
): Record<string, JsonSchemaProperty> {
  const schema = template?.inputSchema;
  if (isRecord(schema) && isRecord(schema.properties)) {
    return schema.properties as Record<string, JsonSchemaProperty>;
  }
  return {};
}

function getInputSchemaRequired(template: PromptTemplateItem | null): string[] {
  const schema = template?.inputSchema as JsonSchema | null | undefined;
  return Array.isArray(schema?.required) ? (schema!.required as string[]) : [];
}

function getFieldKind(prop: JsonSchemaProperty | undefined): FieldKind {
  if (!prop) return "string";
  if (Array.isArray(prop.enum) && prop.enum.length > 0) return "enum";
  if (prop.type === "object" || prop.type === "array" || prop.properties || prop.items) {
    return "json";
  }
  if (prop.type === "number" || prop.type === "integer") return "number";
  if (prop.type === "boolean") return "boolean";
  return "string";
}

const EXAMPLE_FINANCIAL_CONTEXT = {
  walletBalance: 1250.0,
  currency: "USD",
  currentSavingsTotal: 450.0,
  savingsGoalTarget: 1000.0,
  goalProgressPercentage: 45.0,
  monthlyIncome: 2000.0,
  monthlyExpense: 850.0,
};

function defaultRawValue(
  key: string,
  prop: JsonSchemaProperty | undefined,
  kind: FieldKind,
  languageCode: LanguageCode | undefined,
): string {
  const lowerKey = key.toLowerCase();
  if (lowerKey === "question") {
    return languageCode === "km"
      ? "តើខ្ញុំអាចសន្សំប្រាក់បានប៉ុន្មាននៅខែនេះ?"
      : "How much savings progress have I made this month?";
  }
  if (lowerKey === "currencycode") return "USD";
  if (kind === "json" && lowerKey.replace(/_/g, "").includes("financialcontext")) {
    return JSON.stringify(EXAMPLE_FINANCIAL_CONTEXT, null, 2);
  }
  if (kind === "boolean") return "false";
  if (kind === "enum" && Array.isArray(prop?.enum) && prop.enum.length > 0) {
    return String(prop.enum[0]);
  }
  return "";
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

interface ApiErrorDetails {
  message: string;
  fieldErrors: Array<{ field?: string; message: string }>;
}

function extractApiErrorDetails(error: unknown): ApiErrorDetails {
  if (isRecord(error) && "data" in error && isRecord(error.data)) {
    const data = error.data;
    if (Array.isArray(data.fieldErrors) && data.fieldErrors.length > 0) {
      const fieldErrors = (data.fieldErrors as Array<{ field?: string; message?: string }>)
        .filter((f) => typeof f?.message === "string")
        .map((f) => ({ field: f.field, message: f.message as string }));
      if (fieldErrors.length > 0) {
        return {
          message: fieldErrors
            .map((f) => (f.field ? `${f.field} → ${f.message}` : f.message))
            .join(" | "),
          fieldErrors,
        };
      }
    }
    if (typeof data.message === "string") {
      return { message: data.message, fieldErrors: [] };
    }
  }
  if (isRecord(error) && typeof error.message === "string") {
    return { message: error.message, fieldErrors: [] };
  }
  return { message: "Test execution failed.", fieldErrors: [] };
}

export function PromptTemplateTestDialog({
  template,
  isOpen,
  onClose,
}: PromptTemplateTestDialogProps) {
  const { t } = useAdminI18n();
  const [testResult, setTestResult] = useState<TestPromptTemplateResponse | null>(null);

  const [runTest, { isLoading, error: apiError }] = useTestPromptTemplateMutation();

  const inputProperties = useMemo(() => getInputSchemaProperties(template), [template]);
  const requiredFields = useMemo(() => getInputSchemaRequired(template), [template]);
  const fieldKeys = useMemo(() => Object.keys(inputProperties), [inputProperties]);
  const hasDeclaredSchema = fieldKeys.length > 0;

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rawInputJson, setRawInputJson] = useState("");
  const [rawInputError, setRawInputError] = useState<string | null>(null);
  const [sampleOutputRaw, setSampleOutputRaw] = useState("");
  const [sampleOutputError, setSampleOutputError] = useState<string | null>(null);

  useEffect(() => {
    if (!template || !isOpen) return;
    queueMicrotask(() => {
      const properties = getInputSchemaProperties(template);
      const keys = Object.keys(properties);
      if (keys.length > 0) {
        const seeded: Record<string, string> = {};
        keys.forEach((key) => {
          const kind = getFieldKind(properties[key]);
          seeded[key] = defaultRawValue(key, properties[key], kind, template.languageCode);
        });
        setFieldValues(seeded);
        setRawInputJson("");
      } else {
        setFieldValues({});
        setRawInputJson(
          JSON.stringify(
            {
              question:
                template.languageCode === "km"
                  ? "តើខ្ញុំអាចសន្សំប្រាក់បានប៉ុន្មាននៅខែនេះ?"
                  : "How much savings progress have I made this month?",
            },
            null,
            2,
          ),
        );
      }
      setFieldErrors({});
      setRawInputError(null);
      setSampleOutputRaw("");
      setSampleOutputError(null);
      setTestResult(null);
    });
  }, [template, isOpen]);

  if (!template) return null;

  function setFieldValue(key: string, value: string) {
    setFieldValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: "" }));
  }

  function buildDynamicInput(): {
    input?: Record<string, unknown>;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    const input: Record<string, unknown> = {};

    fieldKeys.forEach((key) => {
      const prop = inputProperties[key];
      const kind = getFieldKind(prop);
      const raw = fieldValues[key] ?? "";
      const isRequired = requiredFields.includes(key);

      if (kind === "boolean") {
        input[key] = raw === "true";
        return;
      }

      if (raw.trim() === "") {
        if (isRequired) errors[key] = t("This field is required.");
        return;
      }

      if (kind === "number") {
        const num = Number(raw);
        if (Number.isNaN(num)) {
          errors[key] = t("Must be a valid number.");
        } else {
          input[key] = num;
        }
        return;
      }

      if (kind === "json") {
        try {
          input[key] = JSON.parse(raw);
        } catch {
          errors[key] = t("Must be valid JSON.");
        }
        return;
      }

      input[key] = raw;
    });

    return { input: Object.keys(errors).length === 0 ? input : undefined, errors };
  }

  function buildRawInput(): { input?: Record<string, unknown>; error?: string } {
    if (!rawInputJson.trim()) {
      return { error: t("Input is required.") };
    }
    try {
      const parsed: unknown = JSON.parse(rawInputJson);
      if (!isRecord(parsed)) {
        return { error: t("Input must be a JSON object.") };
      }
      return { input: parsed };
    } catch {
      return { error: t("Must be valid JSON.") };
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!template) return;
    setTestResult(null);

    let input: Record<string, unknown> | undefined;

    if (hasDeclaredSchema) {
      const built = buildDynamicInput();
      setFieldErrors(built.errors);
      if (!built.input) return;
      input = built.input;
    } else {
      const built = buildRawInput();
      setRawInputError(built.error ?? null);
      if (!built.input) return;
      input = built.input;
    }

    let sampleOutput: Record<string, unknown> | undefined;
    if (sampleOutputRaw.trim()) {
      try {
        const parsed: unknown = JSON.parse(sampleOutputRaw);
        if (!isRecord(parsed)) {
          setSampleOutputError(t("Sample output must be a JSON object."));
          return;
        }
        sampleOutput = parsed;
        setSampleOutputError(null);
      } catch {
        setSampleOutputError(t("Must be valid JSON."));
        return;
      }
    } else {
      setSampleOutputError(null);
    }

    const payload: TestPromptTemplatePayload = sampleOutput
      ? { input, sampleOutput }
      : { input };

    if (process.env.NODE_ENV !== "production") {
      console.assert(
        payload.input !== null && typeof payload.input === "object",
        "[PromptTemplateTest] payload.input must be a non-null object",
        payload,
      );
      console.log("[PromptTemplateTest] request payload", payload);
    }

    try {
      const response = await runTest({ templateId: template.id, body: payload }).unwrap();
      setTestResult(response);
    } catch {
      // Surfaced below via apiError.
    }
  }

  const errorDetails = apiError ? extractApiErrorDetails(apiError) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-3xl p-0 font-google-sans">
        {/* Fixed Header */}
        <DialogHeader className="relative shrink-0 border-b border-slate-100 bg-white/95 px-6 py-4.5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-8 sm:py-5 z-10 space-y-0">
          <div className="flex items-center justify-between pr-11 sm:pr-12">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white">
                  {t("Test Prompt Template")}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {template.templateName} ({template.templateKey})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {template.languageCode === "km" ? t("Khmer (km)") : t("English (en)")}
              </Badge>
            </div>
          </div>

          {/* Absolute Top-Right Close Button */}
          <button
            type="button"
            onClick={onClose}
            title={t("Close")}
            className="absolute top-4 right-4 sm:top-5 sm:right-6 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-100/80 text-slate-600 shadow-sm transition-all duration-150 hover:bg-slate-200 hover:border-[#FFC83D] hover:text-[#003377] active:scale-90 active:bg-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D] dark:active:text-[#003377]"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Left Column: Variables Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] uppercase tracking-wider">
                  {t("Input Variables")}
                </h3>

                {hasDeclaredSchema ? (
                  fieldKeys.map((key) => {
                    const prop = inputProperties[key];
                    const kind = getFieldKind(prop);
                    const isRequired = requiredFields.includes(key);
                    const value = fieldValues[key] ?? "";
                    const error = fieldErrors[key];
                    const fieldClassName = `w-full rounded-2xl border bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      error
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`;

                    return (
                      <div key={key} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {humanizeKey(key)} (<code>{`{{${key}}}`}</code>){" "}
                          {isRequired && <span className="text-red-500">*</span>}
                        </label>

                        {key.toLowerCase() === "currencycode" ? (
                          <div className="flex gap-2">
                            {["USD", "KHR"].map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => setFieldValue(key, curr)}
                                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                                  value === curr
                                    ? "bg-[#FFC83D] text-[#003377] font-bold shadow-sm active:bg-[#003377] active:text-[#FFC83D]"
                                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:text-[#003377] active:bg-[#FFC83D]/20 active:text-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                                }`}
                              >
                                {curr}
                              </button>
                            ))}
                          </div>
                        ) : kind === "enum" ? (
                          <select
                            value={value}
                            onChange={(e) => setFieldValue(key, e.target.value)}
                            className={fieldClassName}
                          >
                            <option value="" disabled>
                              {t("Select a value")}
                            </option>
                            {(prop?.enum ?? []).map((option) => (
                              <option key={String(option)} value={String(option)}>
                                {String(option)}
                              </option>
                            ))}
                          </select>
                        ) : kind === "boolean" ? (
                          <div className="flex gap-2">
                            {["true", "false"].map((boolValue) => (
                              <button
                                key={boolValue}
                                type="button"
                                onClick={() => setFieldValue(key, boolValue)}
                                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                                  value === boolValue
                                    ? "bg-[#FFC83D] text-[#003377] font-bold shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                }`}
                              >
                                {boolValue === "true" ? t("True") : t("False")}
                              </button>
                            ))}
                          </div>
                        ) : kind === "number" ? (
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => setFieldValue(key, e.target.value)}
                            className={fieldClassName}
                          />
                        ) : kind === "json" ? (
                          <textarea
                            rows={6}
                            value={value}
                            onChange={(e) => setFieldValue(key, e.target.value)}
                            className={`${fieldClassName} font-mono text-[11px]`}
                          />
                        ) : (
                          <textarea
                            rows={3}
                            value={value}
                            onChange={(e) => setFieldValue(key, e.target.value)}
                            className={fieldClassName}
                          />
                        )}

                        {prop?.description && !error && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {prop.description}
                          </p>
                        )}
                        {error && (
                          <p className="text-xs font-medium text-red-600">{error}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t("Input (JSON)")} <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">
                        {t("Template has no declared input schema")}
                      </p>
                    </div>
                    <textarea
                      rows={10}
                      value={rawInputJson}
                      onChange={(e) => {
                        setRawInputJson(e.target.value);
                        setRawInputError(null);
                      }}
                      className={`w-full rounded-2xl border bg-slate-50/60 p-3 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                        rawInputError
                          ? "border-red-400 focus:border-red-500"
                          : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                      }`}
                    />
                    {rawInputError && (
                      <p className="text-xs font-medium text-red-600">{rawInputError}</p>
                    )}
                  </div>
                )}

                {/* Sample Output (optional) */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Sample Output (JSON, optional)")}
                    </label>
                    {sampleOutputRaw && (
                      <button
                        type="button"
                        onClick={() => {
                          setSampleOutputRaw("");
                          setSampleOutputError(null);
                        }}
                        className="text-[11px] text-slate-500 hover:underline dark:text-slate-400"
                      >
                        {t("Clear")}
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={sampleOutputRaw}
                    onChange={(e) => {
                      setSampleOutputRaw(e.target.value);
                      setSampleOutputError(null);
                    }}
                    placeholder={t("Leave empty to omit sampleOutput")}
                    className={`w-full rounded-2xl border bg-slate-50/60 p-3 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      sampleOutputError
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`}
                  />
                  {sampleOutputError && (
                    <p className="text-xs font-medium text-red-600">{sampleOutputError}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Execution Output */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] uppercase tracking-wider">
                  {t("Execution Output")}
                </h3>

                <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950">
                  {isLoading ? (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center space-y-3 text-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#003377] border-t-transparent dark:border-[#FFC83D]" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {t("Rendering and validating prompt template...")}
                      </p>
                    </div>
                  ) : errorDetails ? (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center space-y-2 text-center text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <p className="text-xs font-semibold">{t("Test execution failed")}</p>
                      {errorDetails.fieldErrors.length > 0 ? (
                        <ul className="space-y-1 text-left text-[11px] text-slate-600 dark:text-slate-400">
                          {errorDetails.fieldErrors.map((fieldError, index) => (
                            <li key={`${fieldError.field ?? "error"}-${index}`}>
                              {fieldError.field && (
                                <code className="font-semibold text-red-600">
                                  {fieldError.field}
                                </code>
                              )}{" "}
                              {fieldError.field && "→"} {fieldError.message}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] text-slate-500">{errorDetails.message}</p>
                      )}
                    </div>
                  ) : testResult ? (
                    <div className="space-y-3">
                      {/* Validation / model metadata */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {typeof testResult.inputValid === "boolean" && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-medium ${
                              testResult.inputValid
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            }`}
                          >
                            {testResult.inputValid ? t("Input valid") : t("Input invalid")}
                          </span>
                        )}
                        {typeof testResult.outputValid === "boolean" && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-medium ${
                              testResult.outputValid
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            }`}
                          >
                            {testResult.outputValid
                              ? t("Output schema valid")
                              : t("Output schema invalid")}
                          </span>
                        )}
                        {testResult.modelName && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            <Zap className="h-3 w-3" /> {testResult.modelName}
                          </span>
                        )}
                      </div>

                      {testResult.renderedSystemPrompt && (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {t("Rendered System Prompt")}
                          </p>
                          <div className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-3 font-mono text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            {testResult.renderedSystemPrompt}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                          {t("Rendered User Prompt")}
                        </p>
                        <div className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-white p-3 font-mono text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                          {testResult.renderedUserPrompt || JSON.stringify(testResult, null, 2)}
                        </div>
                      </div>

                      {testResult.generationConfig && (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                            {t("Generation Config")}
                          </p>
                          <div className="max-h-32 overflow-y-auto rounded-xl bg-white p-3 font-mono text-[11px] text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                            {JSON.stringify(testResult.generationConfig, null, 2)}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center text-center text-slate-400">
                      <Sparkles className="mb-2 h-8 w-8 opacity-40" />
                      <p className="text-xs">{t("Click 'Run Test' to render and validate the template.")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Action Footer */}
          <div className="shrink-0 flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80 sm:px-8 sm:py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-slate-100 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
            >
              {t("Close")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow-md shadow-[#FFC83D]/15 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg active:scale-95 active:bg-[#003377] active:text-[#FFC83D] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
            >
              <Play className="h-4 w-4 fill-current" />
              {isLoading ? t("Running...") : t("Run Test")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
