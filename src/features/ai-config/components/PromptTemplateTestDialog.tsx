"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, AlertCircle, CheckCircle2, Clock, Zap, RotateCcw } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useTestPromptTemplateMutation } from "../api";
import { testPromptTemplateSchema } from "../schemas";
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

  const [question, setQuestion] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [financialContextJson, setFinancialContextJson] = useState("");
  const [temperature, setTemperature] = useState<number>(0.3);
  const [maxTokens, setMaxTokens] = useState<number>(800);
  const [testResult, setTestResult] = useState<TestPromptTemplateResponse | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [runTest, { isLoading, error: apiError }] = useTestPromptTemplateMutation();

  useEffect(() => {
    if (template) {
      // Prepopulate sample test values
      setQuestion(
        template.languageCode === "km"
          ? "តើខ្ញុំអាចសន្សំប្រាក់បានប៉ុន្មាននៅខែនេះ?"
          : "How much savings progress have I made this month?"
      );
      setCurrencyCode("USD");
      setFinancialContextJson(
        JSON.stringify(
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
        )
      );
      setTemperature(
        (template.generationConfig as { temperature?: number })?.temperature ?? 0.3
      );
      setMaxTokens(
        (template.generationConfig as { max_tokens?: number })?.max_tokens ?? 800
      );
      setTestResult(null);
      setJsonError(null);
      setFieldErrors({});
    }
  }, [template]);

  if (!template) return null;

  async function handleRunTest(e: React.FormEvent) {
    e.preventDefault();
    if (!template) return;
    setJsonError(null);
    setTestResult(null);
    setFieldErrors({});

    const formValues = {
      question: question.trim(),
      currencyCode: currencyCode.trim(),
      financialContextJson: financialContextJson.trim() || undefined,
      temperature,
      maxTokens,
    };

    const zodResult = testPromptTemplateSchema.safeParse(formValues);

    if (!zodResult.success) {
      const flattened = zodResult.error.flatten();
      setFieldErrors(flattened.fieldErrors as Record<string, string[]>);
      if (flattened.fieldErrors.financialContextJson?.[0]) {
        setJsonError(flattened.fieldErrors.financialContextJson[0]);
      }
      return;
    }

    let parsedContext: Record<string, unknown> = {};
    if (financialContextJson.trim()) {
      try {
        parsedContext = JSON.parse(financialContextJson);
      } catch {
        setJsonError(t("Invalid JSON in Financial Context"));
        return;
      }
    }

    try {
      const response = await runTest({
        templateId: template.id,
        variables: {
          question: formValues.question,
          currencyCode: formValues.currencyCode,
          financialContext: parsedContext,
        },
        temperature: formValues.temperature,
        maxTokens: formValues.maxTokens,
      }).unwrap();

      setTestResult(response);
    } catch {
      // Error handled by mutation state
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto rounded-3xl p-6 sm:p-8">
        <DialogHeader className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <div>
                <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white">
                  {t("Test Prompt Template")}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {template.templateName} ({template.templateKey})
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {template.languageCode === "km" ? "🇰🇭 Khmer" : "🇬🇧 English"}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleRunTest} className="space-y-6 pt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Left Column: Variables Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#003377] dark:text-[#FFC83D] uppercase tracking-wider">
                {t("Input Variables")}
              </h3>

              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t("User Question")} (<code>{"{{question}}"}</code>)
                </label>
                <textarea
                  rows={3}
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    if (fieldErrors.question) {
                      setFieldErrors((prev) => ({ ...prev, question: [] }));
                    }
                  }}
                  className={`w-full rounded-2xl border bg-slate-50 p-3 text-xs leading-relaxed text-slate-800 focus:bg-white focus:outline-none dark:bg-slate-900 dark:text-slate-200 ${
                    fieldErrors.question?.length
                      ? "border-red-400 focus:border-red-500"
                      : "border-slate-200 focus:border-[#003377] dark:border-slate-800"
                  }`}
                  required
                />
                {fieldErrors.question?.[0] && (
                  <p className="text-xs font-medium text-red-600">
                    {fieldErrors.question[0]}
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
                      onClick={() => setCurrencyCode(curr)}
                      className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                        currencyCode === curr
                          ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
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
                      setFinancialContextJson(
                        JSON.stringify(
                          {
                            walletBalance: 1250.0,
                            currency: currencyCode,
                            currentSavingsTotal: 450.0,
                            savingsGoalTarget: 1000.0,
                          },
                          null,
                          2
                        )
                      )
                    }
                    className="text-[11px] text-[#003377] hover:underline dark:text-[#FFC83D]"
                  >
                    {t("Load Example")}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={financialContextJson}
                  onChange={(e) => {
                    setFinancialContextJson(e.target.value);
                    setJsonError(null);
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-800 focus:border-[#003377] focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
                {jsonError && (
                  <p className="text-xs font-medium text-red-600">{jsonError}</p>
                )}
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{t("Temperature")}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>{t("Max Tokens")}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={100}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
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

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t("Close")}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#003377] px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#002255] disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
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
