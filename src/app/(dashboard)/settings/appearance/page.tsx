"use client";

import React from "react";
import { ThemeSelector } from "@/features/settings/components/theme-selector";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Palette } from "lucide-react";

export default function AppearanceSettingsPage() {
  const { t } = useAdminI18n();

  return (
    <div className="mx-auto max-w-4xl space-y-6 font-google-sans">
      <div className="flex flex-col gap-1 border-b border-slate-200/80 pb-5 dark:border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
            <Palette className="size-5" />
          </div>
          <h1 className="page-title">{t("Appearance & Theme Settings")}</h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("Customize your interface visual style, lighting atmosphere, and transition preferences.")}
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-[#1e293b] dark:bg-[#0b1120] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <ThemeSelector />
      </div>
    </div>
  );
}
