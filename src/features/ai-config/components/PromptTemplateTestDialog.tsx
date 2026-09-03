"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, AlertCircle, Clock, Zap, X } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useTestPromptTemplateMutation } from "../api";
import { testPromptTemplateSchema, type TestPromptTemplateFormData } from "../schemas";
import type { PromptTemplateItem, TestPromptTemplateResponse } from "../types";

interface PromptTemplateTestDialogProps {
  template: PromptTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptTemplateTestDialog({
  template,
  isOpen,
  onClose,
}: PromptTemplateTestDialogProps) {
  const { t } = useAdminI18n();
  const [testResult, setTestResult] = useState<TestPromptTemplateResponse | null>(null);

  const [runTest, { isLoading, error: apiError }] = useTestPromptTemplateMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TestPromptTemplateFormData>({
    resolver: zodResolver(testPromptTemplateSchema),
    defaultValues: {
      question: "",
      currencyCode: "USD",
      financialContextJson: "",
      temperature: 0.3,
      maxTokens: 800,
    },
  });

  const currencyCode = useWatch({ control, name: "currencyCode" }) ?? "USD";
  const temperature = useWatch({ control, name: "temperature" }) ?? 0.3;
  const maxTokens = useWatch({ control, name: "maxTokens" }) ?? 800;

  useEffect(() => {
    if (template && isOpen) {
      queueMicrotask(() => {
        reset({
          question:
            template.languageCode === "km"
              ? "តើខ្ញុំអាចសន្សំប្រាក់បានប៉ុន្មាននៅខែនេះ?"
              : "How much savings progress have I made this month?",
          currencyCode: "USD",
          financialContextJson: JSON.stringify(
            {
              walletBalance: 1250.0,
              currency: "USD",
              currentSavingsTotal: 450.0,
              savingsGoalTarget: 1000.0,
              goalProgressPercentage: 45.0,
              monthlyIncome: 2000.0,
              monthlyExpense: 850.0,
            },
            null,
            2
          ),
          temperature:
            (template.generationConfig as { temperature?: number })?.temperature ?? 0.3,
          maxTokens:
            (template.generationConfig as { max_tokens?: number })?.max_tokens ?? 800,
        });
        setTestResult(null);
      });
    }
  }, [template, isOpen, reset]);

  if (!template) return null;

  async function onSubmit(formData: TestPromptTemplateFormData) {
    if (!template) return;
    setTestResult(null);

    let parsedContext: Record<string, unknown> = {};
    if (
      typeof formData.financialContextJson === "string" &&
      formData.financialContextJson.trim()
    ) {
      try {
        parsedContext = JSON.parse(formData.financialContextJson);
      } catch {
        return;
      }
    } else if (
      typeof formData.financialContextJson === "object" &&
      formData.financialContextJson !== null
    ) {
      parsedContext = formData.financialContextJson as Record<string, unknown>;
    }

    try {
      const response = await runTest({
        templateId: template.id,
        variables: {
          question: formData.question,
          currencyCode: formData.currencyCode,
          financialContext: parsedContext,
        },
        temperature: formData.temperature,
        maxTokens: formData.maxTokens,
      }).unwrap();

      setTestResult(response);
    } catch {
      // Error handled by mutation state
    }
  }

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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Left Column: Variables Form */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] uppercase tracking-wider">
                  {t("Input Variables")}
                </h3>

                {/* Question */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("User Question")} (<code>{"{{question}}"}</code>) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    {...register("question")}
                    className={`w-full rounded-2xl border bg-slate-50/60 p-3 text-xs leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      errors.question
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`}
                  />
                  {errors.question?.message && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                {/* Currency Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t("Currency Code")} (<code>{"{{currencyCode}}"}</code>)
                  </label>
                  <div className="flex gap-2">
                    {["USD", "KHR"].map((curr) => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setValue("currencyCode", curr, { shouldValidate: true })}
                        className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all duration-150 active:scale-95 ${
                          currencyCode === curr
                            ? "bg-[#FFC83D] text-[#003377] font-bold shadow-sm active:bg-[#003377] active:text-[#FFC83D]"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:text-[#003377] active:bg-[#FFC83D]/20 active:text-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                  {errors.currencyCode?.message && (
                    <p className="text-xs font-medium text-red-600">{errors.currencyCode.message}</p>
                  )}
                </div>

                {/* Financial Context JSON */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("Trusted Financial Context (JSON)")}
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "financialContextJson",
                          JSON.stringify(
                            {
                              walletBalance: 1250.0,
                              currency: currencyCode,
                              currentSavingsTotal: 450.0,
                              savingsGoalTarget: 1000.0,
                              goalProgressPercentage: 45.0,
                              monthlyIncome: 2000.0,
                              monthlyExpense: 850.0,
                            },
                            null,
                            2
                          ),
                          { shouldValidate: true }
                        )
                      }
                      className="text-[11px] text-[#003377] hover:underline hover:text-[#002255] active:opacity-75 dark:text-[#FFC83D] dark:hover:text-[#f7c948]"
                    >
                      {t("Load Example")}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    {...register("financialContextJson")}
                    className={`w-full rounded-2xl border bg-slate-50/60 p-3 font-mono text-[11px] leading-relaxed text-slate-800 shadow-sm transition-all duration-200 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:border-[#003377] dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-[#FFC83D] ${
                      errors.financialContextJson
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-[#003377] dark:border-slate-800 dark:focus:border-[#FFC83D]"
                    }`}
                  />
                  {errors.financialContextJson?.message && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.financialContextJson.message}
                    </p>
                  )}
                </div>

                {/* Parameters */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{t("Temperature")}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {temperature}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.1}
                      value={temperature}
                      onChange={(e) =>
                        setValue("temperature", Number(e.target.value), { shouldValidate: true })
                      }
                      className="mt-2 w-full cursor-pointer accent-[#003377] dark:accent-[#FFC83D]"
                    />
                    {errors.temperature?.message && (
                      <p className="text-[10px] text-red-500 mt-1">{errors.temperature.message}</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <span>{t("Max Tokens")}</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {maxTokens}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={2000}
                      step={100}
                      value={maxTokens}
                      onChange={(e) =>
                        setValue("maxTokens", Number(e.target.value), { shouldValidate: true })
                      }
                      className="mt-2 w-full cursor-pointer accent-[#003377] dark:accent-[#FFC83D]"
                    />
                    {errors.maxTokens?.message && (
                      <p className="text-[10px] text-red-500 mt-1">{errors.maxTokens.message}</p>
                    )}
                  </div>
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
                        {t("Executing prompt template with AI model...")}
                      </p>
                    </div>
                  ) : apiError ? (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center space-y-2 text-center text-red-600">
                      <AlertCircle className="h-8 w-8" />
                      <p className="text-xs font-semibold">{t("Test execution failed")}</p>
                      <p className="text-[11px] text-slate-500">
                        {JSON.stringify(apiError)}
                      </p>
                    </div>
                  ) : testResult ? (
                    <div className="space-y-3">
                      {/* Performance metrics */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {testResult.executionTimeMs !== undefined && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <Clock className="h-3 w-3" /> {testResult.executionTimeMs}ms
                          </span>
                        )}
                        {testResult.usage?.totalTokens && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-2 py-0.5 font-medium text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                            <Zap className="h-3 w-3" /> {testResult.usage.totalTokens} {t("tokens")}
                          </span>
                        )}
                      </div>

                      {/* Result Content */}
                      <div className="max-h-72 overflow-y-auto rounded-xl bg-white p-3 font-mono text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {testResult.output ||
                          testResult.result ||
                          JSON.stringify(testResult, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full min-h-64 flex-col items-center justify-center text-center text-slate-400">
                      <Sparkles className="mb-2 h-8 w-8 opacity-40" />
                      <p className="text-xs">{t("Click 'Run Test' to generate and evaluate AI output.")}</p>
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
