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

interface UserRowActionsProps {
  user: AdminUser;
  onViewDetails: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onReactivate: (user: AdminUser) => void;
}

export default function UserRowActions({ user, onViewDetails, onSuspend, onReactivate }: UserRowActionsProps) {
  const isSuspended = user.accountStatus === "SUSPENDED";
  const isActive = user.accountStatus === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User actions" className="size-8">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <Eye className="size-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewDetails(user)}>
          <ClipboardList className="size-4" />
          View Onboarding
        </DropdownMenuItem>
        {isSuspended ? (
          <DropdownMenuItem onClick={() => onReactivate(user)}>
            <ShieldCheck className="size-4" />
            Reactivate User
          </DropdownMenuItem>
        ) : isActive ? (
          <DropdownMenuItem destructive onClick={() => onSuspend(user)}>
            <ShieldAlert className="size-4" />
            Suspend User
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
