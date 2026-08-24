"use client";

import { format, formatDistanceToNow } from "date-fns";
import {
  Mail,
  Phone,
  UserCheck,
  UserX,
  Calendar,
  Copy,
  MessageSquare,
  Hash,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useGetContactByIdQuery } from "../api";
import type { ContactMessage } from "../types";

interface ContactUsDetailModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ContactUsDetailModal({
  message,
  isOpen,
  onClose,
}: ContactUsDetailModalProps) {
  const { t } = useAdminI18n();

  // Fetch single contact message by contactId: GET /api/v1/admin/contact-us/{contactId}
  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError,
    refetch,
  } = useGetContactByIdQuery(message?.id ?? "", {
    skip: !message?.id || !isOpen,
  });

  const activeMessage = detailData || message;

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t(`${label} copied to clipboard!`));
  };

  let formattedDate = activeMessage?.createdAt ?? "";
  let relativeDate = "";
  if (activeMessage?.createdAt) {
    try {
      const d = new Date(activeMessage.createdAt);
      if (!isNaN(d.getTime())) {
        formattedDate = format(d, "PPPP 'at' p");
        relativeDate = formatDistanceToNow(d, { addSuffix: true });
      }
    } catch {
      // keep fallback
    }
  }

  const fullContent =
    activeMessage?.message || activeMessage?.messagePreview || "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-7 font-google-sans"
        onClose={onClose}
      >
        {isDetailLoading && !activeMessage ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-8 w-3/4 rounded-xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
        ) : isError && !activeMessage ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertTriangle className="size-6" />
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {t("Unable to load contact details")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t("Please check your network and try again.")}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="mt-4 gap-2 rounded-xl text-xs font-semibold"
            >
              <RefreshCw className="size-3.5" />
              {t("Retry")}
            </Button>
          </div>
        ) : activeMessage ? (
          <>
            <DialogHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {activeMessage.registeredUser ? (
                  <Badge
                    variant="outline"
                    className="gap-1 rounded-lg border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    <UserCheck className="size-3.5" />
                    {t("Registered User")}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1 rounded-lg border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <UserX className="size-3.5" />
                    {t("Guest Inquiry")}
                  </Badge>
                )}
                {relativeDate && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    • {relativeDate}
                  </span>
                )}
              </div>

              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                {activeMessage.subject}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {t("Contact inquiry received on")} {formattedDate}
              </DialogDescription>
            </DialogHeader>

            {/* Sender Info Card */}
            <div className="mt-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("Sender Information")}
              </p>
              <div className="flex items-start gap-3.5">
                <Avatar className="size-11 border border-slate-200 bg-[#003377] font-bold text-[#FFC83D] shadow-sm dark:border-slate-700">
                  <AvatarFallback>{getInitials(activeMessage.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {activeMessage.name}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `${activeMessage.name} <${activeMessage.email}>`,
                          "Contact info"
                        )
                      }
                      className="h-7 gap-1 rounded-lg px-2 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    >
                      <Copy className="size-3" />
                      {t("Copy")}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <a
                      href={`mailto:${activeMessage.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-[#003377] hover:underline dark:hover:text-[#FFC83D]"
                    >
                      <Mail className="size-3.5 text-slate-400" />
                      <span>{activeMessage.email}</span>
                    </a>
                    {activeMessage.phone && (
                      <a
                        href={`tel:${activeMessage.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-[#003377] hover:underline dark:hover:text-[#FFC83D]"
                      >
                        <Phone className="size-3.5 text-slate-400" />
                        <span>{activeMessage.phone}</span>
                      </a>
                    )}
                  </div>

                  {activeMessage.userId && (
                    <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="font-mono">User ID: {activeMessage.userId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-1" />

            {/* Message Content */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <MessageSquare className="size-3.5" />
                <span>{t("Message Content")}</span>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 text-sm leading-relaxed text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="whitespace-pre-wrap">{fullContent}</p>
              </div>
            </div>

            {/* Metadata Details */}
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50/50 p-3 text-xs text-slate-500 dark:bg-slate-800/30 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-slate-400" />
                <span className="truncate">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="size-3.5 text-slate-400" />
                <span className="truncate font-mono">ID: {activeMessage.id}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-4 flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-4 sm:flex-row sm:justify-between dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 rounded-xl px-5 text-sm font-semibold"
              >
                {t("Close")}
              </Button>

              <div className="flex items-center gap-2">
                {activeMessage.phone && (
                  <a
                    href={`tel:${activeMessage.phone}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    <Phone className="size-4" />
                    {t("Call Phone")}
                  </a>
                )}

                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                    activeMessage.subject
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#003377] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#00275c] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#eab52f]"
                >
                  <Mail className="size-4" />
                  {t("Reply via Email")}
                </a>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
