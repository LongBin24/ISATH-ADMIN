"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminUser } from "@/features/user-manager/types";
import { useCreateAdminNotificationMutation } from "../api";
import { notificationTypeLabel, referenceTypeLabel } from "../presentation";
import {
  ADMIN_NOTIFICATION_TYPES,
  ADMIN_REFERENCE_TYPES,
  type AdminNotificationType,
  type AdminReferenceType,
  type NotificationChannel,
} from "../types";
import NotificationUserSelector from "./NotificationUserSelector";

interface FormState {
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
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<"user" | "title" | "message" | "channels", string>>>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [createNotification, { isLoading }] = useCreateAdminNotificationMutation();

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
    if (!form.user) next.user = "Select a recipient.";
    if (!form.title.trim()) next.title = "Title is required.";
    else if (form.title.trim().length > 200) next.title = "Title must be 200 characters or fewer.";
    if (!form.message.trim()) next.message = "Message is required.";
    else if (form.message.trim().length > 2000) next.message = "Message must be 2,000 characters or fewer.";
    if (form.channels.length === 0) next.channels = "Select at least one delivery channel.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate() || !form.user) return;

    try {
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
      toast.success("Notification sent successfully.");
      reset();
      onOpenChange(false);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to send this notification.");
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
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>Send a system notification to an iStash user.</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Recipient</Label>
            <NotificationUserSelector
              value={form.user}
              onChange={(user) => {
                setForm((current) => ({ ...current, user }));
                setErrors((current) => ({ ...current, user: undefined }));
              }}
              allowClear={false}
              placeholder="Search and select a recipient"
            />
            {errors.user && <p className="text-sm text-destructive">{errors.user}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notification-title">Title</Label>
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

          <div className="space-y-2">
            <Label htmlFor="notification-message">Message</Label>
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
            <div className="space-y-2">
              <Label>Notification Type</Label>
              <Select value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                <SelectTrigger className="h-11 text-base"><SelectValue value={notificationTypeLabel(form.notificationType)} /></SelectTrigger>
                <SelectContent value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                  {ADMIN_NOTIFICATION_TYPES.map((type) => <SelectItem key={type} value={type}>{notificationTypeLabel(type)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">Delivery Channels</legend>
              <div className="flex min-h-11 items-center gap-5 rounded-xl border border-input px-3">
                {(["IN_APP", "EMAIL"] as const).map((channel) => (
                  <label key={channel} className="flex cursor-pointer items-center gap-2 text-base">
                    <input
                      type="checkbox"
                      checked={form.channels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="size-4 rounded border-input accent-[#003377]"
                    />
                    {channel === "IN_APP" ? "In-App" : "Email"}
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
              Advanced Options
              {advancedOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {advancedOpen && (
              <div className="space-y-4 border-t border-border p-4">
                <div className="space-y-2">
                  <Label>Reference Type</Label>
                  <Select value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                    <SelectTrigger className="h-11 text-base"><SelectValue value={form.referenceType === "NONE" ? "No reference" : referenceTypeLabel(form.referenceType)} /></SelectTrigger>
                    <SelectContent value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                      <SelectItem value="NONE">No reference</SelectItem>
                      {ADMIN_REFERENCE_TYPES.map((type) => <SelectItem key={type} value={type}>{referenceTypeLabel(type)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference-id">Reference ID (technical, optional)</Label>
                  <Input id="reference-id" value={form.referenceId} onChange={(event) => setForm((current) => ({ ...current, referenceId: event.target.value }))} className="h-11 text-base" placeholder="UUID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action-url">Action URL (optional)</Label>
                  <Input id="action-url" value={form.actionUrl} onChange={(event) => setForm((current) => ({ ...current, actionUrl: event.target.value }))} className="h-11 text-base" placeholder="/budgets/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires-at">Expiration (optional)</Label>
                  <Input id="expires-at" type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value }))} className="h-11 text-base" />
                </div>
              </div>
            )}
          </div>

          <DialogClose>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-[#FFC83D] text-[#003377] hover:bg-[#f0ba33]">
              <Send className="mr-2 size-4" />
              {isLoading ? "Sending..." : "Send Notification"}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
