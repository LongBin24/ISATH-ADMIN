"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Radio, Send, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminUser } from "@/features/user-manager/types";
import { useCreateAdminNotificationMutation, useBroadcastAdminNotificationMutation } from "../api";
import { notificationTypeLabel, referenceTypeLabel } from "../presentation";
import {
  ADMIN_NOTIFICATION_TYPES,
  ADMIN_REFERENCE_TYPES,
  type AdminNotificationType,
  type AdminReferenceType,
  type NotificationChannel,
} from "../types";
import NotificationUserSelector from "./NotificationUserSelector";
import { useAdminI18n } from "@/i18n/admin-i18n";

type SendMode = "DIRECT" | "BROADCAST";

interface FormState {
  mode: SendMode;
  user: AdminUser | null;
  title: string;
  message: string;
  notificationType: AdminNotificationType;
  channels: NotificationChannel[];
  referenceType: AdminReferenceType | "NONE";
  referenceId: string;
  actionUrl: string;
  expiresAt: string;
}

const INITIAL_FORM: FormState = {
  mode: "DIRECT",
  user: null,
  title: "",
  message: "",
  notificationType: "DAILY_REMINDER",
  channels: ["IN_APP"],
  referenceType: "NONE",
  referenceId: "",
  actionUrl: "",
  expiresAt: "",
};

export default function SendNotificationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<"user" | "title" | "message" | "channels", string>>>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [createNotification, { isLoading: isDirectLoading }] = useCreateAdminNotificationMutation();
  const [broadcastNotification, { isLoading: isBroadcastLoading }] = useBroadcastAdminNotificationMutation();

  const isLoading = isDirectLoading || isBroadcastLoading;

  function reset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setAdvancedOpen(false);
  }

  function toggleChannel(channel: NotificationChannel) {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((item) => item !== channel)
        : [...current.channels, channel],
    }));
    setErrors((current) => ({ ...current, channels: undefined }));
  }

  function validate() {
    const next: typeof errors = {};
    if (form.mode === "DIRECT" && !form.user) next.user = t("Select a recipient.");
    if (!form.title.trim()) next.title = t("Title is required.");
    else if (form.title.trim().length > 200) next.title = t("Title must be 200 characters or fewer.");
    if (!form.message.trim()) next.message = t("Message is required.");
    else if (form.message.trim().length > 2000) next.message = t("Message must be 2,000 characters or fewer.");
    if (form.channels.length === 0) next.channels = t("Select at least one delivery channel.");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    try {
      if (form.mode === "BROADCAST") {
        const res = await broadcastNotification({
          title: form.title.trim(),
          message: form.message.trim(),
          notificationType: form.notificationType,
          sendEmail: form.channels.includes("EMAIL"),
          channels: form.channels,
          referenceType: form.referenceType === "NONE" ? undefined : form.referenceType,
          referenceId: form.referenceId.trim() || undefined,
          actionUrl: form.actionUrl.trim() || undefined,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        }).unwrap();

        const successMessage = t(
          `Broadcast completed: ${res.notificationsCreated}/${res.totalRecipients} created (${res.failedRecipients} failed)`
        );
        toast.success(successMessage, { duration: 5000 });
      } else {
        if (!form.user) return;
        await createNotification({
          userId: form.user.id,
          title: form.title.trim(),
          message: form.message.trim(),
          notificationType: form.notificationType,
          channels: form.channels,
          referenceType: form.referenceType === "NONE" ? undefined : form.referenceType,
          referenceId: form.referenceId.trim() || undefined,
          actionUrl: form.actionUrl.trim() || undefined,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
        }).unwrap();
        toast.success(t("Notification sent successfully."));
      }

      reset();
      onOpenChange(false);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || t("Unable to send this notification."));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{form.mode === "BROADCAST" ? t("Broadcast Notification") : t("Send Notification")}</DialogTitle>
          <DialogDescription>
            {form.mode === "BROADCAST"
              ? t("Broadcast a system notification to all iStash users.")
              : t("Send a system notification to an iStash user.")}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Target Audience Mode Toggle */}
          <div className="space-y-2 space-x-2">
            <Label className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {t("Delivery Mode")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm((c) => ({ ...c, mode: "DIRECT" }))}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition-all duration-200 ${
                  form.mode === "DIRECT"
                    ? "border-[#003377] bg-[#003377]/5 text-[#003377] shadow-sm dark:border-[#FFC83D] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <User className="h-4 w-4" />
                <span>{t("Direct Recipient")}</span>
              </button>

              <button
                type="button"
                onClick={() => setForm((c) => ({ ...c, mode: "BROADCAST" }))}
                className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition-all duration-200 ${
                  form.mode === "BROADCAST"
                    ? "border-[#003377] bg-[#003377]/5 text-[#003377] shadow-sm dark:border-[#FFC83D] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>{t("Broadcast to All Users")}</span>
              </button>
            </div>
          </div>

          {/* Direct Recipient Selector */}
          {form.mode === "DIRECT" ? (
            <div className="space-y-2 space-x-2">
              <Label className="text-base">{t("Recipient")} <span className="text-red-500">*</span></Label>
              <NotificationUserSelector
                value={form.user}
                onChange={(user) => {
                  setForm((current) => ({ ...current, user }));
                  setErrors((current) => ({ ...current, user: undefined }));
                }}
                allowClear={false}
                placeholder={t("Search and select a recipient")}
              />
              {errors.user && <p className="text-sm text-destructive">{errors.user}</p>}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Broadcast Mode Active")}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  {t("This notification will be delivered to all active users on the platform.")}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2 space-x-2">
            <Label htmlFor="notification-title" className="text-base">{t("Title")} <span className="text-red-500">*</span></Label>
            <Input
              id="notification-title"
              value={form.title}
              onChange={(event) => {
                setForm((current) => ({ ...current, title: event.target.value }));
                setErrors((current) => ({ ...current, title: undefined }));
              }}
              className="h-11 text-base"
              maxLength={200}
            />
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-destructive">{errors.title}</span>
              <span className="ml-auto text-muted-foreground">{form.title.length}/200</span>
            </div>
          </div>

          <div className="space-y-2 space-x-2">
            <Label htmlFor="notification-message" className="text-base">{t("Message")} <span className="text-red-500">*</span></Label>
            <textarea
              id="notification-message"
              value={form.message}
              onChange={(event) => {
                setForm((current) => ({ ...current, message: event.target.value }));
                setErrors((current) => ({ ...current, message: undefined }));
              }}
              rows={5}
              maxLength={2000}
              className="w-full rounded-xl border border-input bg-background px-3 py-3 text-base leading-6 text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-destructive">{errors.message}</span>
              <span className="ml-auto text-muted-foreground">{form.message.length}/2,000</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 space-x-2">
              <Label className="text-base">{t("Notification Type")}</Label>
              <Select value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                <SelectTrigger className="h-11 text-base"><SelectValue value={t(notificationTypeLabel(form.notificationType))} /></SelectTrigger>
                <SelectContent value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                  {ADMIN_NOTIFICATION_TYPES.map((type) => <SelectItem key={type} value={type}>{t(notificationTypeLabel(type))}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <fieldset className="space-y-2 space-x-2">
              <legend className="text-base font-medium text-foreground">{t("Delivery Channels")}</legend>
              <div className="flex min-h-11 items-center gap-5 rounded-xl border border-input px-3">
                {(["IN_APP", "EMAIL"] as const).map((channel) => (
                  <label key={channel} className="flex cursor-pointer items-center gap-2 text-base">
                    <input
                      type="checkbox"
                      checked={form.channels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="size-4 rounded border-input accent-[#003377]"
                    />
                    {channel === "IN_APP" ? t("In-App") : t("Email")}
                  </label>
                ))}
              </div>
              {errors.channels && <p className="text-sm text-destructive">{errors.channels}</p>}
            </fieldset>
          </div>

          <div className="rounded-2xl border border-border">
            <button
              type="button"
              onClick={() => setAdvancedOpen((value) => !value)}
              className="flex w-full items-center justify-between px-4 py-3 text-base font-medium text-foreground"
            >
              {t("Advanced Options")}
              {advancedOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {advancedOpen && (
              <div className="space-y-4 border-t border-border p-4">
                <div className="space-y-2 space-x-2">
                  <Label className="text-base">{t("Reference Type")}</Label>
                  <Select value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                    <SelectTrigger className="h-11 text-base"><SelectValue value={form.referenceType === "NONE" ? t("No reference") : t(referenceTypeLabel(form.referenceType))} /></SelectTrigger>
                    <SelectContent value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                      <SelectItem value="NONE">{t("No reference")}</SelectItem>
                      {ADMIN_REFERENCE_TYPES.map((type) => <SelectItem key={type} value={type}>{t(referenceTypeLabel(type))}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 space-x-2">
                  <Label htmlFor="reference-id" className="text-base">{t("Reference ID (technical, optional)")}</Label>
                  <Input id="reference-id" value={form.referenceId} onChange={(event) => setForm((current) => ({ ...current, referenceId: event.target.value }))} className="h-11 text-base" placeholder="UUID" />
                </div>
                <div className="space-y-2 space-x-2">
                  <Label htmlFor="action-url" className="text-base">{t("Action URL (optional)")}</Label>
                  <Input id="action-url" value={form.actionUrl} onChange={(event) => setForm((current) => ({ ...current, actionUrl: event.target.value }))} className="h-11 text-base" placeholder="/budgets/..." />
                </div>
                <div className="space-y-2 space-x-2">
                  <Label htmlFor="expires-at" className="text-base">{t("Expiration (optional)")}</Label>
                  <Input id="expires-at" type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} className="h-11 text-base" />
                </div>
              </div>
            )}
          </div>

          <DialogClose className="sticky bottom-0 mt-0 flex flex-col-reverse gap-2 border-t border-border/70 bg-card/95 pt-4 backdrop-blur sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="h-11 min-w-28 rounded-xl text-base" onClick={() => onOpenChange(false)}>{t("Cancel")}</Button>
            <Button type="submit" disabled={isLoading} className="h-11 min-w-44 rounded-xl bg-[#FFC83D] px-5 text-base font-semibold text-[#003377] hover:bg-[#f0ba33]">
              <Send className="mr-2 size-4" />
              {isLoading ? (form.mode === "BROADCAST" ? t("Broadcasting...") : t("Sending...")) : (form.mode === "BROADCAST" ? t("Broadcast Notification") : t("Send Notification"))}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
