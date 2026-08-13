"use client";

import { KeyRound, User, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  );
}
