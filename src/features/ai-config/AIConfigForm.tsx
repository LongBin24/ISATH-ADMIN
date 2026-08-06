"use client";

import { useState } from "react";
import { Bot, ChevronLeft, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const models = ["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-8"];

const stats = [
  { label: "ចំណូល", value: "12,450 requests", status: "98.2%" },
  { label: "OCR", value: "3,210 requests", status: "96.4%" },
  { label: "Voice", value: "890 requests", status: "91.7%" },
];

export default function AIConfigForm() {
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
    setMessage("ការកំណត់ AI រក្សាទុកដោយជោគជ័យ។");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003377] dark:text-white">
            កំណត់មុខងារ AI
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            គ្រប់គ្រង Ai feature
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center justify-center gap-2 rounded-full  px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948]"
        >
          <ChevronLeft size={18} /> Admin{" "}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"
      >
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-4​ text-[#003377]">
            {[
              {
                label: "AI សកម្ម",
                description: "បើក/បិទ AI រួមទាំងការបញ្ចេញលទ្ធផល។",
                enabled: aiEnabled,
                setEnabled: setAiEnabled,
              },
              {
                label: "OCR រៀបចំអត្ថបទ",
                description: "បម្លែងរូបភាពទៅអត្ថបទដោយស្វ័យប្រវត្តិ",
                enabled: ocrEnabled,
                setEnabled: setOcrEnabled,
              },
              {
                label: "Voice-to-text",
                description: "បម្លែងសំឡេងទៅអត្ថបទ",
                enabled: voiceEnabled,
                setEnabled: setVoiceEnabled,
              },
              {
                label: "Tag ស្វ័យប្រវត្តិ",
                description: "បង្កើតស្លាកដោយស្វ័យប្រវត្តិ",
                enabled: smartTagEnabled,
                setEnabled: setSmartTagEnabled,
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900"
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
                  onClick={() => feature.setEnabled(!feature.enabled)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    feature.enabled
                      ? "bg-[#FFC83D] text-[#003377]"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {feature.enabled ? "On" : "Off"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="mt-3 text-2xl font-bold text-[#003377] dark:text-white">
                  កំណត់ Model
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                Default
              </span>
            </div>

            <div className="space-y-3">
              <p className=" text-[#003377] ">Claude Model</p>
              {models.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setModel(option)}
                  className={`flex w-full items-center justify-between rounded-3xl border px-4 py-4 text-left text-sm transition ${
                    model === option
                      ? "border-[#FFC83D] bg-[#FEF3C7] text-slate-500"
                      : "border-slate-200 bg-white text-[#003377] hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  }`}
                >
                  <span>{option}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {model === option ? "Selected" : "Select"}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
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
                  ស្ថានភាព AI
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ទិន្នន័យស្ថិតិ និងស្ថានភាពប្រតិបត្តិការ។
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
                    <p className="font-semibold text-[#003377]      dark:text-white">
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
            រក្សាទុកការកំណត់ AI
          </button>
        </div>
      </form>
    </div>
  );
}
