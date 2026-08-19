"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminUser } from "@/features/user-manager/types";
import { AccountStatusBadge, OnboardingBadge, VerifiedBadge } from "./status-badges";
import UserRowActions from "./UserRowActions";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onViewDetails: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onReactivate: (user: AdminUser) => void;
}

function displayName(user: AdminUser) {
  return user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email;
}

export default function UserTable({ users, isLoading, onViewDetails, onSuspend, onReactivate }: UserTableProps) {
  const { t } = useAdminI18n();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-base font-semibold">{t("User")}</TableHead>
            <TableHead className="text-base font-semibold">{t("Email")}</TableHead>
            <TableHead className="text-base font-semibold">{t("Status")}</TableHead>
            <TableHead className="text-base font-semibold">{t("Verified")}</TableHead>
            <TableHead className="text-base font-semibold">{t("Onboarding")}</TableHead>
            <TableHead className="text-base font-semibold">{t("Created")}</TableHead>
            <TableHead className="w-12 text-right text-base font-semibold">{t("Action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7} className="py-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-16 text-center text-base text-muted-foreground">
                {t("No users found.")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const name = displayName(user);
              return (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                  onClick={() => onViewDetails(user)}
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={user.profileImageUrl ?? undefined} alt={name} />
                        <AvatarFallback>{name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-foreground">{name}</p>
                        {user.username && (
                          <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="block max-w-[220px] truncate text-base text-foreground">
                          {user.email}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>{user.email}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <AccountStatusBadge status={user.accountStatus} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <VerifiedBadge verified={user.emailVerified} />
                  </TableCell>
                  <TableCell className="py-3.5">
                    <OnboardingBadge completed={user.onboardingCompleted} />
                  </TableCell>
                  <TableCell className="py-3.5 text-sm text-muted-foreground">
                    {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <UserRowActions
                      user={user}
                      onViewDetails={onViewDetails}
                      onSuspend={onSuspend}
                      onReactivate={onReactivate}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
