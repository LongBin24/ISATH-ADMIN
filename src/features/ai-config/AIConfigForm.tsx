"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, AlertCircle } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { aiConfigSchema, type AIConfigFormData } from "./schemas";

const models = ["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-8"];

export default function AIConfigForm() {
  const { t } = useAdminI18n();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AIConfigFormData>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      model: models[0],
      confidence: 90,
      aiEnabled: true,
      ocrEnabled: true,
      voiceEnabled: true,
      smartTagEnabled: true,
    },
  });

  const model = useWatch({ control, name: "model" });
  const confidence = useWatch({ control, name: "confidence" }) ?? 90;
  const aiEnabled = useWatch({ control, name: "aiEnabled" }) ?? true;
  const ocrEnabled = useWatch({ control, name: "ocrEnabled" }) ?? true;
  const voiceEnabled = useWatch({ control, name: "voiceEnabled" }) ?? true;
  const smartTagEnabled = useWatch({ control, name: "smartTagEnabled" }) ?? true;

  const stats = [
    { label: t("Income"), value: `12,450 ${t("requests")}`, status: "98.2%" },
    { label: t("OCR Text Processing"), value: `3,210 ${t("requests")}`, status: "96.4%" },
    { label: t("Voice-to-Text"), value: `890 ${t("requests")}`, status: "91.7%" },
  ];

  function onSubmit() {
    setErrorMessage(null);
    setMessage(t("AI configuration saved successfully."));
  }

  function onError() {
    setMessage(null);
    const firstError = Object.values(errors)[0]?.message;
    if (firstError) {
      setErrorMessage(firstError);
    }
  }

  return (
    <div className="space-y-6 font-google-sans">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] sm:text-2xl md:text-[32px]">
            {t("Model & Assistant Capabilities")}
          </h2>
          <p className="mt-1 text-[18px] leading-relaxed text-slate-500 dark:text-slate-400">
            {t(
              "Manage and configure AI assistant capabilities, models, and OCR."
            )}
          </p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
          {message}
        </div>
      )}

      {(errorMessage || Object.keys(errors).length > 0) && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <span>
            {errorMessage ||
              errors.model?.message ||
              errors.confidence?.message ||
              t("Failed to save AI configuration.")}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4 mb-2 text-[#003377]">
            {[
              {
                name: "aiEnabled" as const,
                label: t("Active AI"),
                description: t(
                  "Enable or disable AI output generation across the platform.",
                ),
                enabled: aiEnabled,
              },
              {
                name: "ocrEnabled" as const,
                label: t("OCR Text Processing"),
                description: t(
                  "Automatically extract and parse transaction data from receipt images.",
                ),
                enabled: ocrEnabled,
              },
              {
                name: "voiceEnabled" as const,
                label: t("Voice-to-Text"),
                description: t(
                  "Convert voice memos and audio recordings into transactions.",
                ),
                enabled: voiceEnabled,
              },
              {
                name: "smartTagEnabled" as const,
                label: t("Smart Tagging"),
                description: t(
                  "Automatically categorize and tag transactions using AI intelligence.",
                ),
                enabled: smartTagEnabled,
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center justify-between rounded-3xl border border-slate-200/80 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/50"
              >
                <div>
                  <p className="font-semibold text-[#003377] dark:text-white">
                    {feature.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue(feature.name, !feature.enabled, { shouldValidate: true })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 ${
                    feature.enabled
                      ? "bg-[#FFC83D] text-[#003377] hover:bg-[#f0ba33] active:bg-[#003377] active:text-[#FFC83D]"
                      : "border border-slate-200 bg-slate-200 text-slate-700 hover:border-[#003377] hover:text-[#003377] active:bg-[#FFC83D]/20 active:text-[#003377] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
                  }`}
                >
                  {feature.enabled ? t("On") : t("Off")}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="mt-3 text-2xl font-bold text-[#003377] dark:text-white">
                  {t("Model Configuration")}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {t("Default")}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[#003377] dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                {t("Claude Model")}
              </p>
              {models.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setValue("model", option, { shouldValidate: true })}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-150 active:scale-95 ${
                    model === option
                      ? "border-[#FFC83D] bg-[#FFC83D]/15 text-[#003377] dark:text-[#FFC83D]"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#003377] hover:text-[#003377] active:bg-[#FFC83D]/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/10"
                  }`}
                >
                  <span>{option}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {model === option ? t("Selected") : t("Select")}
                  </span>
                </button>
              ))}
              {errors.model && (
                <p className="text-xs font-medium text-red-500">{errors.model.message}</p>
              )}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>{t("Confidence Threshold")}</span>
                <span>{confidence}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={99}
                value={confidence}
                onChange={(event) =>
                  setValue("confidence", Number(event.target.value), { shouldValidate: true })
                }
                className="mt-4 w-full cursor-pointer accent-[#003377] dark:accent-[#FFC83D]"
              />
              {errors.confidence && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.confidence.message}</p>
              )}
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6 flex items-center gap-3 text-[#003377] dark:text-slate-200">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#FFC83D]/10 text-[#003377]">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003377]">
                  {t("AI Status")}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("Statistical data and operational status.")}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <p className="font-semibold text-[#003377] dark:text-white">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {item.value}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#FFC83D] px-6 py-4 text-sm font-bold text-[#003377] shadow-md shadow-[#FFC83D]/15 transition-all duration-150 hover:bg-[#f0ba33] hover:shadow-lg active:scale-95 active:bg-[#003377] active:text-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948] dark:active:bg-[#002255] dark:active:text-[#FFC83D]"
          >
            {t("Save AI Configuration")}
          </button>
        </div>
      </form>
    </div>
  );
}
