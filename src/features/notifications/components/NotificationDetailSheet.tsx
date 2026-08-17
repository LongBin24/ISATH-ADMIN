"use client";

import { format } from "date-fns";
import { AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/features/user-manager/types";
import { useGetAdminNotificationByIdQuery } from "../api";
import { NOTIFICATION_TYPE_UI, notificationTypeLabel, referenceTypeLabel } from "../presentation";
import type { AdminNotificationItem } from "../types";
import { useAdminI18n } from "@/i18n/admin-i18n";

function userName(user?: AdminUser) {
  return user
    ? user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email
    : "Unknown user";
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[140px_1fr] sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="break-words text-base font-medium text-foreground sm:text-right">{children}</div>
    </div>
  );
}

export default function NotificationDetailSheet({
  notification,
  user,
  open,
  onOpenChange,
}: {
  notification: AdminNotificationItem | null;
  user?: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useAdminI18n();
  const notificationId = notification?.id ?? "";
  const { data, isLoading, isError, refetch } = useGetAdminNotificationByIdQuery(notificationId, {
    skip: !open || !notificationId,
  });
  const detail = data ?? notification;
  const name = userName(user);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-xl" onClose={() => onOpenChange(false)}>
        <SheetHeader>
          <SheetTitle>{t("Notification Details")}</SheetTitle>
          <p className="mt-1 text-base text-muted-foreground">{t("Review the message, recipient, and technical context.")}</p>
        </SheetHeader>
        <SheetBody>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : isError || !detail ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-lg font-semibold text-foreground">{t("Unable to load notification details.")}</p>
              <Button variant="outline" onClick={() => refetch()}><RefreshCw className="mr-2 size-4" />{t("Retry")}</Button>
            </div>
          ) : (
            <>
              <section>
                <div className="flex items-start gap-3">
                  {(() => {
                    const Icon = NOTIFICATION_TYPE_UI[detail.notificationType]?.icon;
                    return Icon ? <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]"><Icon className="size-5" /></span> : null;
                  })()}
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-foreground">{detail.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className={NOTIFICATION_TYPE_UI[detail.notificationType]?.badgeClassName}>{t(notificationTypeLabel(detail.notificationType))}</Badge>
                      <Badge variant="outline">{t(detail.read ? "Read" : "Unread")}</Badge>
                    </div>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-muted/50 p-4 text-base leading-7 text-foreground">{detail.message}</p>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-semibold text-foreground">{t("Recipient")}</h3>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border p-4">
                  <Avatar className="size-11">
                    <AvatarImage src={user?.profileImageUrl ?? undefined} alt={name} />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-base font-medium text-foreground">{name}</p>
                    <p className="truncate text-sm text-muted-foreground">{user?.email ?? detail.userId}</p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-semibold text-foreground">{t("Notification Information")}</h3>
                <div className="mt-2 divide-y divide-border">
                  <DetailField label={t("Type")}>{t(notificationTypeLabel(detail.notificationType))}</DetailField>
                  <DetailField label={t("Reference")}>{t(referenceTypeLabel(detail.referenceType))}</DetailField>
                  {detail.referenceId && <DetailField label={t("Reference ID")}><span className="font-mono text-sm">{detail.referenceId}</span></DetailField>}
                  <DetailField label={t("Created")}>{format(new Date(detail.createdAt), "PPp")}</DetailField>
                  <DetailField label={t("Expires")}>{detail.expiresAt ? format(new Date(detail.expiresAt), "PPp") : "—"}</DetailField>
                  <DetailField label={t("Action URL")}>
                    {detail.actionUrl ? <a href={detail.actionUrl} className="inline-flex items-center gap-1 text-[#003377] hover:underline dark:text-[#FFC83D]"><span className="break-all">{detail.actionUrl}</span><ExternalLink className="size-4 shrink-0" /></a> : "—"}
                  </DetailField>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-semibold text-foreground">{t("Delivery")}</h3>
                <div className="mt-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4">
                  <p className="text-base text-muted-foreground">{t("Delivery details are not available from the current API.")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("Retry actions appear only when a failed delivery and its channel are known.")}</p>
                </div>
              </section>
            </>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
