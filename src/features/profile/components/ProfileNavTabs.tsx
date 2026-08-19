"use client";

<<<<<<< HEAD
import { KeyRound, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminI18n } from "@/i18n/admin-i18n";
=======
import React from "react";
import { User, UserCog, KeyRound, Coins, Bell } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

export type ProfileTabKey = "overview" | "edit" | "password";

<<<<<<< HEAD
export default function ProfileNavTabs({ activeTab, onTabChange }: { activeTab: ProfileTabKey; onTabChange: (tab: ProfileTabKey) => void }) {
  const { t } = useAdminI18n();
  const tabs = [
    { id: "overview" as const, label: "Overview", icon: User },
    { id: "edit" as const, label: "Edit Profile", icon: UserCog },
    { id: "password" as const, label: "Security", icon: KeyRound },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="overflow-x-auto p-2">
        <nav className="flex min-w-max gap-1" aria-label={t("Profile sections")}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <Button key={tab.id} type="button" variant={active ? "default" : "ghost"} onClick={() => onTabChange(tab.id)} className={active ? "h-11 rounded-xl bg-[#003377] px-4 text-white hover:bg-[#00285d] dark:bg-[#FEDB55] dark:text-[#003377]" : "h-11 rounded-xl px-4 text-muted-foreground"} aria-current={active ? "page" : undefined}>
                <Icon className="mr-2 size-4" />{t(tab.label)}
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
=======
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
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  );
}
