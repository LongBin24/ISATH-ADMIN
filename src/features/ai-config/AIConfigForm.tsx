"use client";

import { useState } from "react";
import { Bot, ChevronLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/hooks/use-i18n";

const models = ["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-8"];

export default function AIConfigForm() {
  const { locale, dict } = useI18n();
  const [model, setModel] = useState(models[0]);
  const [confidence, setConfidence] = useState(90);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [smartTagEnabled, setSmartTagEnabled] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(dict.common.success);
  }

  const stats = [
    { label: dict.transactions.income, value: "12,450 requests", status: "98.2%" },
    { label: "OCR", value: "3,210 requests", status: "96.4%" },
    { label: "Voice", value: "890 requests", status: "91.7%" },
  ];

  return (
    <div className="space-y-6 font-google-sans">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003377] dark:text-white">
            {dict.aiConfig.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {dict.aiConfig.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/dashboard`)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#003377] transition hover:border-[#FFC83D] hover:bg-[#FFC83D] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D] dark:hover:text-[#003377]"
        >
          <ChevronLeft size={18} /> {dict.nav.dashboard}
        </button>
      </div>

      {message && (
        <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-4 mb-2 text-[#003377]">
            {[
              {
                label: "AI Active",
                description: "Enable/disable automated AI assistance and predictions.",
                checked: aiEnabled,
                onChange: setAiEnabled,
              },
              {
                label: "OCR Service",
                description: "Recognize receipt text and invoice values automatically.",
                checked: ocrEnabled,
                onChange: setOcrEnabled,
              },
              {
                label: "Voice Processing",
                description: "Process Khmer and English voice audio commands.",
                checked: voiceEnabled,
                onChange: setVoiceEnabled,
              },
              {
                label: "Smart Tagging",
                description: "Categorize transactions with auto-assigned labels.",
                checked: smartTagEnabled,
                onChange: setSmartTagEnabled,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div>
                  <p className="text-sm font-semibold text-[#003377] dark:text-slate-200">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#003377] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-slate-800 dark:peer-checked:bg-[#FFC83D]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex items-center gap-3 text-[#003377] dark:text-slate-200">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#FFC83D]/10 text-[#003377]">
                <Settings size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003377] dark:text-slate-200">
                  {dict.aiConfig.model}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select default language model
                </p>
              </div>
            </div>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Confidence Threshold</span>
                <span>{confidence}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={99}
                value={confidence}
                onChange={(event) => setConfidence(Number(event.target.value))}
                className="mt-4 w-full"
              />
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6 flex items-center gap-3 text-[#003377] dark:text-slate-200">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#FFC83D]/10 text-[#003377]">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#003377]">
                  {dict.dashboard.aiStatus}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Real-time analytics and status
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
            className="w-full rounded-full bg-[#FFC83D] px-6 py-4 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948]"
          >
            {dict.aiConfig.saveConfig}
          </button>
        </div>
      </form>
    </div>
  );
}
