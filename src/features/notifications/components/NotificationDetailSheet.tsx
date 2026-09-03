"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ExternalLink,
  Info,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/features/user-manager/types";
import { useGetAdminNotificationByIdQuery } from "../api";
import {
  NOTIFICATION_TYPE_UI,
  notificationTypeLabel,
  referenceTypeLabel,
  getNotificationRecipientName,
  getNotificationRecipientSubtext,
} from "../presentation";
import type { AdminNotificationItem } from "../types";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-4 items-center">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <div className="break-words text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-right">{children}</div>
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
  const unknownLabel = t("Unknown user");
  const name = detail ? getNotificationRecipientName(detail, user, unknownLabel) : "";
  const subtext = detail ? getNotificationRecipientSubtext(detail, user, t) : "";
  const isUnknown = !user && name === unknownLabel;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-xl font-google-sans" onClose={() => onOpenChange(false)}>
        <SheetHeader className="border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
              <Bell className="size-5.5" />
            </span>
            <div className="min-w-0">
              <SheetTitle className="text-xl font-bold text-[#003377] dark:text-[#FFC83D]">
                {t("Notification Details")}
              </SheetTitle>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {t("Review the message, recipient, and technical context.")}
              </p>
            </div>
          </div>
        </SheetHeader>

        <SheetBody className="space-y-6 pt-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 rounded-xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ) : isError || !detail ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-lg font-semibold text-foreground">{t("Unable to load notification details.")}</p>
              <Button
                variant="outline"
                onClick={() => refetch()}
                className="rounded-xl border-slate-300 hover:border-[#003377] hover:text-[#003377] dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
              >
                <RefreshCw className="mr-2 size-4" />
                {t("Retry")}
              </Button>
            </div>
          ) : (
            <>
              {/* Notification Message Card */}
              <section className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4.5 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex items-start gap-3.5">
                  {(() => {
                    const Icon = NOTIFICATION_TYPE_UI[detail.notificationType]?.icon;
                    return Icon ? (
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D] shadow-sm shadow-[#003377]/25 dark:bg-[#FFC83D] dark:text-[#003377]">
                        <Icon className="size-5.5" />
                      </span>
                    ) : null;
                  })()}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {detail.title}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn("rounded-lg font-semibold px-2.5 py-0.5 text-xs", NOTIFICATION_TYPE_UI[detail.notificationType]?.badgeClassName)}
                      >
                        {t(notificationTypeLabel(detail.notificationType))}
                      </Badge>
                      {detail.read ? (
                        <Badge
                          variant="outline"
                          className="rounded-lg border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="size-3" />
                          {t("Read")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="rounded-lg border-[#FFC83D] bg-[#FFC83D]/15 px-2.5 py-0.5 text-xs font-bold text-[#003377] dark:text-[#FFC83D]"
                        >
                          {t("Unread")}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200/80 border-l-4 border-l-[#003377] bg-white p-4 text-base leading-relaxed text-slate-800 shadow-2xs dark:border-slate-800 dark:border-l-[#FFC83D] dark:bg-slate-950/60 dark:text-slate-200">
                  {detail.message}
                </div>
              </section>

              <Separator className="bg-slate-200/80 dark:bg-slate-800" />

              {/* Recipient Section */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
                  <User className="size-4 text-[#003377] dark:text-[#FFC83D]" />
                  {t("Recipient")}
                </h3>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar className="size-11 border border-slate-200 shadow-2xs dark:border-slate-700">
                      <AvatarImage src={user?.profileImageUrl ?? undefined} alt={name} />
                      <AvatarFallback
                        className={
                          isUnknown
                            ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-[#003377] text-[#FFC83D] font-bold dark:bg-[#FFC83D] dark:text-[#003377]"
                        }
                      >
                        {isUnknown ? <User className="size-5" /> : name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-slate-900 dark:text-white">{name}</p>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{subtext}</p>
                    </div>
                  </div>
                  {!user && (
                    <Badge
                      variant="outline"
                      className="border-dashed border-amber-300 bg-amber-50/70 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 shrink-0"
                    >
                      {t("Unlinked Account")}
                    </Badge>
                  )}
                </div>
              </section>

              <Separator className="bg-slate-200/80 dark:bg-slate-800" />

              {/* Notification Information Section */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
                  <Info className="size-4 text-[#003377] dark:text-[#FFC83D]" />
                  {t("Notification Information")}
                </h3>
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 px-4 divide-y divide-slate-200/70 dark:border-slate-800 dark:bg-slate-900/40 dark:divide-slate-800/80">
                  <DetailField label={t("Type")}>
                    <span className="font-bold text-[#003377] dark:text-[#FFC83D]">
                      {t(notificationTypeLabel(detail.notificationType))}
                    </span>
                  </DetailField>
                  <DetailField label={t("Reference")}>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {t(referenceTypeLabel(detail.referenceType))}
                    </span>
                  </DetailField>
                  {detail.referenceId && (
                    <DetailField label={t("Reference ID")}>
                      <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {detail.referenceId}
                      </span>
                    </DetailField>
                  )}
                  <DetailField label={t("Created")}>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {format(new Date(detail.createdAt), "PPp")}
                    </span>
                  </DetailField>
                  <DetailField label={t("Expires")}>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {detail.expiresAt ? format(new Date(detail.expiresAt), "PPp") : "N/A"}
                    </span>
                  </DetailField>
                  <DetailField label={t("Action URL")}>
                    {detail.actionUrl ? (
                      <a
                        href={detail.actionUrl}
                        className="inline-flex items-center gap-1.5 font-semibold text-[#003377] hover:underline dark:text-[#FFC83D]"
                      >
                        <span className="break-all">{detail.actionUrl}</span>
                        <ExternalLink className="size-4 shrink-0" />
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </DetailField>
                </div>
              </section>

              <Separator className="bg-slate-200/80 dark:bg-slate-800" />

              {/* Delivery Section */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
                  <Send className="size-4 text-[#003377] dark:text-[#FFC83D]" />
                  {t("Delivery")}
                </h3>
                <div className="rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("Delivery details are not available from the current API.")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t("Retry actions appear only when a failed delivery and its channel are known.")}
                  </p>
                </div>
              </section>
            </>
          )}
        </SheetBody>

        <SheetFooter className="border-t border-slate-200/80 pt-4 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto rounded-xl border-slate-200 px-6 text-base font-semibold text-slate-700 transition hover:border-[#003377] hover:text-[#003377] dark:border-slate-700 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
