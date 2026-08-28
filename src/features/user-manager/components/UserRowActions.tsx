"use client";

import { Eye, ClipboardList, MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminUser } from "@/features/user-manager/types";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface UserRowActionsProps {
  user: AdminUser;
  onViewDetails: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onReactivate: (user: AdminUser) => void;
}

export default function UserRowActions({ user, onViewDetails, onSuspend, onReactivate }: UserRowActionsProps) {
  const { t } = useAdminI18n();
  const isSuspended = user.accountStatus === "SUSPENDED";
  const isActive = user.accountStatus === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("User actions")}
          className="size-8.5 rounded-xl border border-slate-200/80 bg-transparent text-slate-600 shadow-2xs transition hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]"
        >
          <MoreHorizontal className="size-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <Eye className="size-4" />
          {t("View Details")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <ClipboardList className="size-4" />
          {t("View Onboarding")}
        </DropdownMenuItem>
        {isSuspended ? (
          <DropdownMenuItem onClick={() => onReactivate(user)}>
            <ShieldCheck className="size-4" />
            {t("Reactivate User")}
          </DropdownMenuItem>
        ) : isActive ? (
          <DropdownMenuItem destructive onClick={() => onSuspend(user)}>
            <ShieldAlert className="size-4" />
            {t("Suspend User")}
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
