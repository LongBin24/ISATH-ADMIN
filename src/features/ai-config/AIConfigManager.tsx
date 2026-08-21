"use client";

import { useState } from "react";
import { Sparkles, Sliders, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PromptTemplateManager } from "./components/PromptTemplateManager";
import AIConfigForm from "./AIConfigForm";

export default function AIConfigManager() {
  const { t } = useAdminI18n();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("prompt-templates");

  return (
    <div className="space-y-7 font-google-sans">
      {/* Feature Header matching category/currency/user-management pattern */}
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

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/dashboard")}
            className="border-border text-base font-medium text-[#003377] transition-all duration-150 hover:border-[#003377] hover:text-[#003377] active:scale-95 active:bg-[#FFC83D]/20 active:border-[#FFC83D] active:text-[#003377] dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] dark:active:bg-[#FFC83D]/20 dark:active:text-[#FFC83D]"
          >
            <ArrowLeft className="mr-2 size-4" />
            {t("Dashboard")}
          </Button>
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
