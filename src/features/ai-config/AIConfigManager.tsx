"use client";

import { useState } from "react";
import { Sparkles, Sliders, Bot, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PromptTemplateManager } from "./components/PromptTemplateManager";
import AIConfigForm from "./AIConfigForm";

export default function AIConfigManager() {
  const { t } = useAdminI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("prompt-templates");

  return (
    <div className="space-y-6 font-google-sans">
      {/* Top Banner Header */}
      <header className="relative overflow-hidden rounded-3xl bg-[#003377] px-6 py-7 text-white shadow-lg shadow-[#003377]/10 sm:px-8 sm:py-8">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-24 size-64 rounded-full bg-[#FFC83D]/20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-32 h-1 w-40 rounded-full bg-[#FFC83D]"
        />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#FFC83D] text-[#003377] shadow-lg shadow-[#FFC83D]/20">
              <Bot className="size-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {t("AI Configuration & Prompt Templates")}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-white/80">
                {t(
                  "Manage system prompt templates, version histories, AI assistant capabilities, and model generation parameters."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("Dashboard")}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
          <TabsList className="h-12 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/80">
            <TabsTrigger
              value="prompt-templates"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition data-[state=active]:bg-white data-[state=active]:text-[#003377] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-[#FFC83D]"
            >
              <Sparkles className="h-4 w-4" />
              {t("Prompt Templates")}
            </TabsTrigger>

            <TabsTrigger
              value="model-settings"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition data-[state=active]:bg-white data-[state=active]:text-[#003377] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-[#FFC83D]"
            >
              <Sliders className="h-4 w-4" />
              {t("Model & Assistant Capabilities")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="prompt-templates" className="focus-visible:outline-none">
          <PromptTemplateManager />
        </TabsContent>

        <TabsContent value="model-settings" className="focus-visible:outline-none">
          <AIConfigForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
