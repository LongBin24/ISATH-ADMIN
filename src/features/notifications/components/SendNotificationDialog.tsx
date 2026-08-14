"use client";

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
import toast from "react-hot-toast";

export default function SendNotificationDialog() {
  const { dict, isEnglish } = useI18n();
  const { isTriggerModalOpen, toggleTriggerModal } = useNotificationUI();
  const [createAdminNotification, { isLoading }] =
    useCreateAdminNotificationMutation();
  const { data: usersList = [] } = useGetUsersQuery();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("");

  useEffect(() => {
    if (usersList.length > 0 && !selectedUserId) {
      setSelectedUserId(usersList[0].id);
    }
  }, [usersList, selectedUserId]);

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

  const selectedCategory = watch("category");

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

  if (!isTriggerModalOpen) return null;

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
    }
  };

  return (
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
            />
            {errors.customTitleKh && (
              <p className="text-[11px] font-bold text-red-500">
                {errors.customTitleKh.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.customMessageLabel}
            </label>
            <textarea
              rows={3}
              {...register("customMessageKh")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder={isEnglish ? "Enter message content..." : "បញ្ចូលខ្លឹមសារសារ..."}
            />
            {errors.customMessageKh && (
              <p className="text-[11px] font-bold text-red-500">
                {errors.customMessageKh.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
