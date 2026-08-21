"use client";

import { useState } from "react";
import { Sparkles, Sliders } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PromptTemplateManager } from "./components/PromptTemplateManager";
import AIConfigForm from "./AIConfigForm";

export default function AIConfigManager() {
  const { t } = useAdminI18n();
  const [activeTab, setActiveTab] = useState<string>("prompt-templates");

  return (
    <div className="space-y-7 font-google-sans">
      {/* Feature Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">
            {t("AI Configuration")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground font-normal">
            {t(
              "Manage system prompt templates, version histories, AI assistant capabilities, and model parameters."
            )}
          </p>
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
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all duration-150 hover:text-[#003377] active:scale-95 dark:hover:text-[#FFC83D] data-[state=active]:bg-white data-[state=active]:text-[#003377] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-[#FFC83D]"
            >
              <Sparkles className="h-4 w-4" />
              {t("Prompt Templates")}
            </TabsTrigger>

            <TabsTrigger
              value="model-settings"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all duration-150 hover:text-[#003377] active:scale-95 dark:hover:text-[#FFC83D] data-[state=active]:bg-white data-[state=active]:text-[#003377] data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-[#FFC83D]"
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
