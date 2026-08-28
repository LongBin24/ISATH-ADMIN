"use client";

import React from "react";
import { Moon, Sun, Check, Sparkles, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, mounted, setTheme, isToggling } = useTheme();
  const { t } = useAdminI18n();

  const handleSelectTheme = (
    mode: "light" | "dark",
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (theme === mode) return;
    setTheme(mode, e);
  };

  const isDark = mounted ? theme === "dark" : false;

  return (
    <div className="space-y-6 font-google-sans">
      <div>
        <div className="flex items-center gap-2">
          <Shield className="size-5 text-[#003377] dark:text-[#FFC83D]" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("Appearance & Theme Settings")}
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {t("Choose your visual interface style for the iStash Command Center.")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Light Mode Card */}
        <button
          type="button"
          onClick={(e) => handleSelectTheme("light", e)}
          disabled={isToggling}
          className={cn(
            "group relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 active:scale-[0.98]",
            !isDark
              ? "border-[#003377] bg-white shadow-lg ring-2 ring-[#003377]/20 dark:border-[#FFC83D] dark:ring-[#FFC83D]/30"
              : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white dark:border-[#1e293b] dark:bg-[#0b1120]/60 dark:hover:border-slate-700"
          )}
        >
          {/* Active check indicator */}
          {!isDark && (
            <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-[#003377] text-[#FFC83D] shadow-sm">
              <Check className="size-3.5 stroke-[3]" />
            </span>
          )}

          {/* Mini UI Preview Representation */}
          <div className="mb-4 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-[#f4f6fa] p-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-slate-300" />
                <span className="size-2 rounded-full bg-slate-300" />
                <span className="size-2 rounded-full bg-slate-300" />
              </div>
              <span className="text-[10px] font-bold text-[#003377]">iStash</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-2 w-3/4 rounded-sm bg-slate-200" />
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <div className="h-6 rounded-md bg-white border border-slate-200/70" />
                <div className="h-6 rounded-md bg-white border border-slate-200/70" />
                <div className="h-6 rounded-md bg-[#003377]/10 border border-[#003377]/20" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-[#111d35] dark:text-[#FFC83D]">
              <Sun className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {t("Light Mode")}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("Clean Command-Center with soft off-white canvas")}
              </p>
            </div>
          </div>
        </button>

        {/* Dark Mode Card (PoliceAI-inspired) */}
        <button
          type="button"
          onClick={(e) => handleSelectTheme("dark", e)}
          disabled={isToggling}
          className={cn(
            "group relative flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 active:scale-[0.98]",
            isDark
              ? "border-[#FFC83D] bg-[#0b1120] shadow-[0_4px_24px_rgba(0,0,0,0.6)] ring-2 ring-[#FFC83D]/40 police-glow-gold"
              : "border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white dark:border-[#1e293b] dark:bg-[#0b1120]/60 dark:hover:border-slate-700"
          )}
        >
          {/* Active check indicator */}
          {isDark && (
            <span className="absolute right-4 top-4 flex size-6 items-center justify-center rounded-full bg-[#FFC83D] text-[#003377] shadow-sm">
              <Check className="size-3.5 stroke-[3]" />
            </span>
          )}

          {/* Mini UI Preview Representation */}
          <div className="mb-4 w-full overflow-hidden rounded-xl border border-[#1e293b] bg-[#030712] p-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#1e293b]" />
                <span className="size-2 rounded-full bg-[#1e293b]" />
                <span className="size-2 rounded-full bg-[#1e293b]" />
              </div>
              <span className="text-[10px] font-bold text-[#FFC83D]">iStash AI</span>
            </div>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-2 w-3/4 rounded-sm bg-[#1e293b]" />
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <div className="h-6 rounded-md bg-[#0b1120] border border-[#1e293b]" />
                <div className="h-6 rounded-md bg-[#0b1120] border border-[#1e293b]" />
                <div className="h-6 rounded-md bg-[#FFC83D]/10 border border-[#FFC83D]/30" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-[#FFC83D] border border-slate-700/50 shadow-inner">
              <Moon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {t("Dark Mode (PoliceAI)")}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("Tactical obsidian near-black with glowing accents")}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Feature Information Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur dark:border-[#1e293b] dark:bg-[#0b1120]/70">
        <div className="flex items-start gap-3">
          <Sparkles className="size-5 shrink-0 text-[#FFC83D] mt-0.5" />
          <div className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              {t("Futuristic Radial Transition")}
            </p>
            <p className="mt-0.5">
              {t("Switching themes plays an animated button sequence followed by a smooth circular expansion originating from your click position, maintaining fluid 60fps rendering without flicker.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;
