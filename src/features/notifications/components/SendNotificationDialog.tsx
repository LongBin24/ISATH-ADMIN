"use client";

<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Send, AlertCircle, Sparkles } from "lucide-react";
import {
  triggerNotificationSchema,
  TriggerNotificationFormData,
} from "../types";
import { useCreateAdminNotificationMutation } from "../api";
import { useGetUsersQuery } from "@/features/users/api";
import { useNotificationUI } from "../hook";
import { CATEGORY_CONFIGS } from "../constants";
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
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
import { useAdminI18n } from "@/i18n/admin-i18n";

<<<<<<< HEAD
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
=======
export default function SendNotificationDialog() {
  const { dict, isEnglish } = useI18n();
  const { isTriggerModalOpen, toggleTriggerModal } = useNotificationUI();
  const [createAdminNotification, { isLoading }] =
    useCreateAdminNotificationMutation();
  const { data: usersList = [] } = useGetUsersQuery();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

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

<<<<<<< HEAD
export default function SendNotificationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<"user" | "title" | "message" | "channels", string>>>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [createNotification, { isLoading }] = useCreateAdminNotificationMutation();
=======
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TriggerNotificationFormData>({
    resolver: zodResolver(triggerNotificationSchema),
    defaultValues: {
      category: "DAILY_REMINDER",
      channel: "BOTH",
      customTitleKh: isEnglish
        ? "Time to record today's expenses!"
        : "ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃ!",
      customMessageKh: isEnglish
        ? "Please take a minute to record your transactions for today."
        : "សូមចំណាយពេល 1 នាទីដើម្បីកត់ត្រាប្រតិបត្តិការចំណាយរបស់អ្នកសម្រាប់ថ្ងៃនេះ។",
      priority: "MEDIUM",
    },
  });
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

  function reset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setAdvancedOpen(false);
  }

<<<<<<< HEAD
  function toggleChannel(channel: NotificationChannel) {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((item) => item !== channel)
        : [...current.channels, channel],
    }));
    setErrors((current) => ({ ...current, channels: undefined }));
  }
=======
  useEffect(() => {
    if (isEnglish) {
      switch (selectedCategory) {
        case "DAILY_REMINDER":
          setValue("customTitleKh", "Time to record today's expenses!");
          setValue(
            "customMessageKh",
            "Please take a minute to record your transactions for today."
          );
          setValue("priority", "MEDIUM");
          break;
        case "BUDGET_WARNING":
          setValue(
            "customTitleKh",
            "Warning: 'Food & Dining' expenses are near the limit!"
          );
          setValue(
            "customMessageKh",
            "You have spent 85% of your $400.00 monthly budget limit."
          );
          setValue("priority", "HIGH");
          break;
        case "SAVINGS_REMINDER":
          setValue("customTitleKh", "Congratulations! Savings goal reached 75%");
          setValue(
            "customMessageKh",
            "You have saved $750.00 towards your $1,000.00 total goal."
          );
          setValue("priority", "MEDIUM");
          break;
        case "RECURRING_REMINDER":
          setValue(
            "customTitleKh",
            "Payment Reminder: Bill due tomorrow"
          );
          setValue(
            "customMessageKh",
            "Your monthly internet service bill of $35.00 is due tomorrow."
          );
          setValue("priority", "HIGH");
          break;
        case "MONTHLY_SUMMARY":
          setValue("customTitleKh", "July Monthly Financial Summary Report");
          setValue(
            "customMessageKh",
            "Total income $2,450.00, total expenses $1,280.00, net savings $1,170.00."
          );
          setValue("priority", "LOW");
          break;
      }
    } else {
      switch (selectedCategory) {
        case "DAILY_REMINDER":
          setValue("customTitleKh", "ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃ!");
          setValue(
            "customMessageKh",
            "សូមចំណាយពេល 1 នាទីដើម្បីកត់ត្រាប្រតិបត្តិការចំណាយរបស់អ្នកសម្រាប់ថ្ងៃនេះ។"
          );
          setValue("priority", "MEDIUM");
          break;
        case "BUDGET_WARNING":
          setValue(
            "customTitleKh",
            "ការព្រមាន៖ ការចំណាយលើ «អាហារ» ជិតដល់កម្រិតកំណត់!"
          );
          setValue(
            "customMessageKh",
            "អ្នកបានចំណាយ 85% នៃថវិកាប្រចាំខែដែលបានកំណត់ចំនួន $400.00 ក្នុងខែនេះហើយ។"
          );
          setValue("priority", "HIGH");
          break;
        case "SAVINGS_REMINDER":
          setValue("customTitleKh", "អបអរសាទរ! គោលដៅសន្សំសម្រេចបាន 75%");
          setValue(
            "customMessageKh",
            "អ្នកបានសន្សំប្រាក់បាន $750.00 នៃគោលដៅសរុប $1,000.00។"
          );
          setValue("priority", "MEDIUM");
          break;
        case "RECURRING_REMINDER":
          setValue(
            "customTitleKh",
            "ការរំលឹកបង់ប្រាក់៖ វិក្កយបត្រត្រូវបង់នៅថ្ងៃស្អែក"
          );
          setValue(
            "customMessageKh",
            "វិក្កយបត្រប្រចាំខែសេវាអ៊ីនធឺណិតចំនួន $35.00 នឹងត្រូវទូទាត់នៅថ្ងៃស្អែក។"
          );
          setValue("priority", "HIGH");
          break;
        case "MONTHLY_SUMMARY":
          setValue("customTitleKh", "របាយការណ៍ហិរញ្ញវត្ថុសង្ខេបប្រចាំខែកក្កដា");
          setValue(
            "customMessageKh",
            "ចំណូលសរុប $2,450.00, ចំណាយសរុប $1,280.00, សន្សំសុទ្ធ $1,170.00។"
          );
          setValue("priority", "LOW");
          break;
      }
    }
  }, [selectedCategory, setValue, isEnglish]);
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

  function validate() {
    const next: typeof errors = {};
    if (!form.user) next.user = t("Select a recipient.");
    if (!form.title.trim()) next.title = t("Title is required.");
    else if (form.title.trim().length > 200) next.title = t("Title must be 200 characters or fewer.");
    if (!form.message.trim()) next.message = t("Message is required.");
    else if (form.message.trim().length > 2000) next.message = t("Message must be 2,000 characters or fewer.");
    if (form.channels.length === 0) next.channels = t("Select at least one delivery channel.");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

<<<<<<< HEAD
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
      toast.success(t("Notification sent successfully."));
      reset();
      onOpenChange(false);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || t("Unable to send this notification."));
=======
  const onSubmit = async (data: TriggerNotificationFormData) => {
    setSubmitError(null);
    const targetUser =
      selectedUserId || (usersList.length > 0 ? usersList[0].id : "");

    if (!targetUser) {
      setSubmitError(
        isEnglish
          ? "Please select or enter the recipient User UUID."
          : "សូមជ្រើសរើស ឬបញ្ចូល User UUID ដែលត្រូវទទួលការជូនដំណឹង"
      );
      return;
    }

    const channelMap: Record<string, ("IN_APP" | "EMAIL")[]> = {
      BOTH: ["IN_APP", "EMAIL"],
      IN_APP: ["IN_APP"],
      EMAIL: ["EMAIL"],
    };
    const channels = channelMap[data.channel] || ["IN_APP"];

    try {
      await createAdminNotification({
        userId: targetUser,
        title: data.customTitleKh || (isEnglish ? "System Notification" : "ការជូនដំណឹងពីប្រព័ន្ធ"),
        message: data.customMessageKh || (isEnglish ? "Notification details" : "ព័ត៌មានលម្អិតនៃការជូនដំណឹង"),
        notificationType: data.category || "DAILY_REMINDER",
        channels,
      }).unwrap();
      toast.success(isEnglish ? "Notification sent successfully!" : "បានផ្ញើការជូនដំណឹងជោគជ័យ!");
      toggleTriggerModal(false);
      reset();
    } catch (e: any) {
      setSubmitError(
        e?.data?.message ||
          e?.message ||
          (isEnglish ? "Failed to send notification. Please try again." : "មិនអាចផ្ញើការជូនដំណឹងបានទេ សូមព្យាយាមម្តងទៀត")
      );
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
    }
  }

  return (
<<<<<<< HEAD
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{t("Send Notification")}</DialogTitle>
          <DialogDescription>{t("Send a system notification to an iStash user.")}</DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-base">{t("Recipient")}</Label>
            <NotificationUserSelector
              value={form.user}
              onChange={(user) => {
                setForm((current) => ({ ...current, user }));
                setErrors((current) => ({ ...current, user: undefined }));
              }}
              allowClear={false}
              placeholder={t("Search and select a recipient")}
=======
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 font-google-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#003377] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#FFC83D]" size={20} />
            <h3 className="text-base font-bold font-google-sans">
              {dict.notifications.sendDialogTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => toggleTriggerModal(false)}
            aria-label={dict.common.close}
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 font-google-sans"
        >
          {submitError && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 p-3 text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/30">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.selectRecipient}
            </label>
            {usersList.length > 0 ? (
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#FFC83D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {usersList.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email || u.id})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                placeholder="User UUID..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.selectCategory}
            </label>
            <select
              {...register("category")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#FFC83D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {Object.values(CATEGORY_CONFIGS).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isEnglish ? cat.nameEn : cat.nameKh}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {dict.notifications.deliveryChannel}
              </label>
              <select
                {...register("channel")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="BOTH">{dict.notifications.channelBoth}</option>
                <option value="IN_APP">{dict.notifications.channelInApp}</option>
                <option value="EMAIL">{dict.notifications.channelEmail}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {dict.notifications.priorityLabelForm}
              </label>
              <select
                {...register("priority")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="LOW">{dict.notifications.priorityLow}</option>
                <option value="MEDIUM">{dict.notifications.priorityMedium}</option>
                <option value="HIGH">{dict.notifications.priorityHigh}</option>
                <option value="URGENT">{dict.notifications.priorityUrgent}</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.customTitleLabel}
            </label>
            <input
              type="text"
              {...register("customTitleKh")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder={isEnglish ? "Enter title..." : "បញ្ចូលចំណងជើង..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            />
            {errors.user && <p className="text-sm text-destructive">{errors.user}</p>}
          </div>

<<<<<<< HEAD
          <div className="space-y-2">
            <Label htmlFor="notification-title" className="text-base">{t("Title")}</Label>
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
            <Label htmlFor="notification-message" className="text-base">{t("Message")}</Label>
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
=======
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.customMessageLabel}
            </label>
            <textarea
              rows={3}
              {...register("customMessageKh")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder={isEnglish ? "Enter message content..." : "បញ្ចូលខ្លឹមសារសារ..."}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            />
            <div className="flex justify-between gap-3 text-sm">
              <span className="text-destructive">{errors.message}</span>
              <span className="ml-auto text-muted-foreground">{form.message.length}/2,000</span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base">{t("Notification Type")}</Label>
              <Select value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                <SelectTrigger className="h-11 text-base"><SelectValue value={t(notificationTypeLabel(form.notificationType))} /></SelectTrigger>
                <SelectContent value={form.notificationType} onValueChange={(value) => setForm((current) => ({ ...current, notificationType: value as AdminNotificationType }))}>
                  {ADMIN_NOTIFICATION_TYPES.map((type) => <SelectItem key={type} value={type}>{t(notificationTypeLabel(type))}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <fieldset className="space-y-2">
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
<<<<<<< HEAD
              onClick={() => setAdvancedOpen((value) => !value)}
              className="flex w-full items-center justify-between px-4 py-3 text-base font-medium text-foreground"
            >
              {t("Advanced Options")}
              {advancedOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
=======
              onClick={() => toggleTriggerModal(false)}
              className="inline-flex min-w-[80px] h-10 items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              {dict.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex min-w-[150px] h-10 items-center justify-center gap-2 rounded-xl bg-[#003377] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] transition active:scale-95 disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377] whitespace-nowrap shrink-0"
            >
              <Send size={14} />
              <span>{isLoading ? dict.notifications.sendingBtn : dict.notifications.sendBtn}</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </button>
            {advancedOpen && (
              <div className="space-y-4 border-t border-border p-4">
                <div className="space-y-2">
                  <Label className="text-base">{t("Reference Type")}</Label>
                  <Select value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                    <SelectTrigger className="h-11 text-base"><SelectValue value={form.referenceType === "NONE" ? t("No reference") : t(referenceTypeLabel(form.referenceType))} /></SelectTrigger>
                    <SelectContent value={form.referenceType} onValueChange={(value) => setForm((current) => ({ ...current, referenceType: value as FormState["referenceType"] }))}>
                      <SelectItem value="NONE">{t("No reference")}</SelectItem>
                      {ADMIN_REFERENCE_TYPES.map((type) => <SelectItem key={type} value={type}>{t(referenceTypeLabel(type))}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference-id" className="text-base">{t("Reference ID (technical, optional)")}</Label>
                  <Input id="reference-id" value={form.referenceId} onChange={(event) => setForm((current) => ({ ...current, referenceId: event.target.value }))} className="h-11 text-base" placeholder="UUID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action-url" className="text-base">{t("Action URL (optional)")}</Label>
                  <Input id="action-url" value={form.actionUrl} onChange={(event) => setForm((current) => ({ ...current, actionUrl: event.target.value }))} className="h-11 text-base" placeholder="/budgets/..." />
                </div>
                <div className="space-y-2">
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
              {isLoading ? t("Sending...") : t("Send Notification")}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
