"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminI18n } from "@/i18n/admin-i18n";

export default function UserManagementHeader({ onAddUser }: { onAddUser: () => void }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-foreground sm:text-3xl">{t("User Management")}</h1>
        <p className="mt-1 text-base text-muted-foreground">
          {t("Manage, monitor, and control iStash user accounts.")}
        </p>
      </div>
      <Button size="lg" onClick={onAddUser} className="bg-[#FFC83D] text-[#003377] hover:bg-[#f0ba33]">
        <UserPlus className="mr-2 size-4" />
        {t("Add User")}
      </Button>
    </div>
  );
}
