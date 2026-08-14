"use client";

import React from "react";
import { User, UserCog, KeyRound, Coins, Bell } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

export type ProfileTabKey = "overview" | "edit" | "password" | "currency" | "notifications";

interface ProfileNavTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
}

export default function ProfileNavTabs({
  activeTab,
  onTabChange,
}: ProfileNavTabsProps) {
  const { dict } = useI18n();

  const tabs: { id: ProfileTabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: dict.profile.tabOverview, icon: User },
    { id: "edit", label: dict.profile.tabEdit, icon: UserCog },
    { id: "password", label: dict.profile.tabPassword, icon: KeyRound },
    { id: "currency", label: dict.profile.tabCurrency, icon: Coins },
    { id: "notifications", label: dict.profile.tabNotifications, icon: Bell },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <nav className="flex min-w-max space-x-1 sm:space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all font-google-sans whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#FFC83D] dark:text-[#003377]" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
