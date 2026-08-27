"use client";

import { format, formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, Eye, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AdminUser } from "@/features/user-manager/types";
import type { AdminNotificationItem } from "../types";
import { NOTIFICATION_TYPE_UI, notificationTypeLabel, referenceTypeLabel } from "../presentation";
import { useAdminI18n } from "@/i18n/admin-i18n";

function userName(user?: AdminUser) {
  return user
    ? user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email
    : "Unknown user";
}

export default function NotificationTable({
  notifications,
  usersById,
  isLoading,
  sortDirection,
  onSortDirectionChange,
  onView,
}: {
  notifications: AdminNotificationItem[];
  usersById: Map<string, AdminUser>;
  isLoading: boolean;
  sortDirection: "ASC" | "DESC";
  onSortDirectionChange: (direction: "ASC" | "DESC") => void;
  onView: (notification: AdminNotificationItem) => void;
}) {
  const { t } = useAdminI18n();

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-56 text-base font-semibold">{t("Recipient")}</TableHead>
            <TableHead className="min-w-72 text-base font-semibold">{t("Notification")}</TableHead>
            <TableHead className="min-w-40 text-base font-semibold">{t("Type")}</TableHead>
            <TableHead className="min-w-36 text-base font-semibold">{t("Reference")}</TableHead>
            <TableHead className="min-w-28 text-base font-semibold">{t("Read Status")}</TableHead>
            <TableHead className="min-w-40 text-base font-semibold">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 hover:text-foreground"
                onClick={() => onSortDirectionChange(sortDirection === "DESC" ? "ASC" : "DESC")}
              >
                {t("Created")}
                {sortDirection === "DESC" ? <ArrowDown className="size-3.5" /> : <ArrowUp className="size-3.5" />}
              </button>
            </TableHead>
            <TableHead className="w-14 text-right text-base font-semibold">{t("Actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 7 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={7} className="py-4"><Skeleton className="h-11 w-full" /></TableCell>
              </TableRow>
            ))
          ) : (
            notifications.map((notification) => {
              const user = usersById.get(notification.userId);
              const name = userName(user);
              const typeUi = NOTIFICATION_TYPE_UI[notification.notificationType];
              return (
                <TableRow key={notification.id} className="cursor-pointer" onClick={() => onView(notification)}>
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage src={user?.profileImageUrl ?? undefined} alt={name} />
                        <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-foreground">{name}</p>
                        <Tooltip>
                          <TooltipTrigger><span className="block max-w-44 truncate text-sm text-muted-foreground">{user?.email ?? notification.userId}</span></TooltipTrigger>
                          <TooltipContent>{user?.email ?? notification.userId}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <p className="max-w-80 truncate text-base font-medium text-foreground">{notification.title}</p>
                    <p className="mt-1 max-w-80 truncate text-sm text-muted-foreground">{notification.message}</p>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Badge variant="outline" className={`text-sm font-medium ${typeUi?.badgeClassName ?? ""}`}>
                      {t(notificationTypeLabel(notification.notificationType))}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 text-base text-foreground">{t(referenceTypeLabel(notification.referenceType))}</TableCell>
                  <TableCell className="py-3.5">
                    <Badge variant="outline" className={notification.read ? "border-slate-200 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300" : "border-blue-200 bg-blue-50 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300"}>
                      {t(notification.read ? "Read" : "Unread")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 text-base text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</TooltipTrigger>
                      <TooltipContent>{format(new Date(notification.createdAt), "PPpp")}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 text-right" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Notification actions"
                          className="size-8.5 rounded-xl border border-slate-200/80 bg-transparent text-slate-600 shadow-2xs transition hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]"
                        >
                          <MoreHorizontal className="size-4.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onView(notification)}>
                          <Eye className="size-4" />
                          {t("View Details")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
