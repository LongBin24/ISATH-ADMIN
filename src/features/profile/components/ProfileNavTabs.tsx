"use client";

import { KeyRound, User, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminI18n } from "@/i18n/admin-i18n";

export type ProfileTabKey = "overview" | "edit" | "password";

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
        <nav className="flex min-w-max gap-2" aria-label={t("Profile sections")}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all duration-150 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:scale-95 cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent ${
                  active
                    ? "border border-[#003377] text-[#003377] dark:border-[#FFC83D] dark:text-[#FFC83D]"
                    : "border border-slate-200/80 text-slate-600 hover:border-[#003377] hover:text-[#003377] dark:border-slate-800 dark:text-slate-400 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-4" />
                {t(tab.label)}
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
