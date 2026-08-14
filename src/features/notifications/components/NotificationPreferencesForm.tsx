"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Mail,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  Wallet,
  AlertTriangle,
  Target,
  Repeat,
  BarChart3,
  Moon,
} from "lucide-react";
import {
  preferencesSchema,
  PreferencesFormData,
  NotificationCategory,
} from "../types";
import {
  useGetNotificationPreferencesQuery,
  useUpdatePreferencesMutation,
} from "../api";
import { CATEGORY_CONFIGS } from "../constants";
import { useI18n } from "@/hooks/use-i18n";

export default function NotificationPreferencesForm() {
  const { dict, isEnglish } = useI18n();
  const { data: initialPrefs, isLoading } =
    useGetNotificationPreferencesQuery();
  const [updatePreferences, { isLoading: isSaving }] =
    useUpdatePreferencesMutation();
  const [successToast, setSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      email: "",
      quietHoursEnabled: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      digestFrequency: "DAILY",
      categories: [],
    },
  });

  const { fields } = useFieldArray<PreferencesFormData>({
    control,
    name: "categories",
  });

  useEffect(() => {
    if (initialPrefs) {
      reset({
        email: initialPrefs.email,
        quietHoursEnabled: initialPrefs.quietHoursEnabled,
        quietHoursStart: initialPrefs.quietHoursStart,
        quietHoursEnd: initialPrefs.quietHoursEnd,
        digestFrequency: initialPrefs.digestFrequency,
        categories: initialPrefs.categories,
      });
    }
  }, [initialPrefs, reset]);

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      await updatePreferences(data).unwrap();
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "DAILY_EXPENSE":
        return <Wallet className="text-[#FFC83D]" size={20} />;
      case "BUDGET_WARNING":
        return <AlertTriangle className="text-red-500" size={20} />;
      case "SAVINGS_GOAL":
        return <Target className="text-emerald-500" size={20} />;
      case "RECURRING_TX":
        return (
          <Repeat className="text-[#003377] dark:text-sky-400" size={20} />
        );
      case "MONTHLY_SUMMARY":
        return <BarChart3 className="text-indigo-500" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3 font-google-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFC83D] border-t-transparent" />
        <p className="text-sm font-semibold text-slate-500">
          {dict.notifications.prefLoading}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-4xl font-google-sans"
    >
      {/* Toast Banner */}
      {successToast && (
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-4 text-sm font-bold text-emerald-600 border border-emerald-500/30 animate-in fade-in">
          <CheckCircle size={20} />
          <span>{dict.notifications.prefSavedSuccess}</span>
        </div>
      )}

      {/* 1. General Email & Channel Settings Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#003377] dark:bg-slate-800 dark:text-[#FFC83D]">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
              {dict.notifications.prefEmailSectionTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dict.notifications.prefEmailSectionDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.prefEmailLabel}
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FFC83D] focus:ring-2 focus:ring-[#FFC83D]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="user@example.com"
            />
            {errors.email?.message && (
              <p className="text-xs font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} />
                {String(errors.email.message)}
              </p>
            )}
          </div>

          {/* Digest Frequency */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {dict.notifications.prefDigestLabel}
            </label>
            <select
              {...register("digestFrequency")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#FFC83D] focus:ring-2 focus:ring-[#FFC83D]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="INSTANT">{dict.notifications.prefDigestInstant}</option>
              <option value="DAILY">{dict.notifications.prefDigestDaily}</option>
              <option value="WEEKLY">{dict.notifications.prefDigestWeekly}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Notification Features & Channels Configuration */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[#003377] dark:bg-slate-800 dark:text-[#FFC83D]">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
                {dict.notifications.prefChannelsSectionTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dict.notifications.prefChannelsSectionDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Feature List Cards */}
        <div className="space-y-4">
          {fields.map((field, index) => {
            const config = CATEGORY_CONFIGS[field.category];
            const categoryName = field.category;
            const categoryDisplayName = isEnglish
              ? config?.nameEn || field.category
              : config?.nameKh || field.category;
            const categoryDisplayDesc = isEnglish
              ? config?.descriptionEn || config?.descriptionKh
              : config?.descriptionKh;

            return (
              <div
                key={field.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-slate-50/70 p-5 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                {/* Feature Icon & Title */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-xs">
                    {getCategoryIcon(field.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-google-sans">
                      {categoryDisplayName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mt-0.5">
                      {categoryDisplayDesc}
                    </p>

                    {/* Conditional sub-settings for daily expense or budget warning */}
                    {categoryName === "DAILY_EXPENSE" && (
                      <div className="mt-3 flex items-center gap-2">
                        <Clock size={14} className="text-[#FFC83D]" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {dict.notifications.prefDailyReminderTime}
                        </span>
                        <input
                          type="time"
                          {...register(`categories.${index}.reminderTime`)}
                          className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />
                      </div>
                    )}

                    {categoryName === "BUDGET_WARNING" && (
                      <div className="mt-3 flex items-center gap-2">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {dict.notifications.prefWarningThreshold}
                        </span>
                        <input
                          type="number"
                          min={50}
                          max={100}
                          {...register(`categories.${index}.thresholdPercent`, {
                            valueAsNumber: true,
                          })}
                          className="w-16 rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />
                        <span className="text-xs text-slate-400">
                          {dict.notifications.prefOfBudget}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Channel Toggles */}
                <div className="flex items-center gap-6 self-end md:self-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  {/* In-App Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`categories.${index}.inAppEnabled`)}
                      className="h-4 w-4 rounded border-slate-300 text-[#003377] focus:ring-[#FFC83D]"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Bell
                        size={14}
                        className="text-[#003377] dark:text-[#FFC83D]"
                      />
                      {dict.notifications.prefInApp}
                    </span>
                  </label>

                  {/* Email Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer border-l border-slate-200 pl-4 dark:border-slate-800">
                    <input
                      type="checkbox"
                      {...register(`categories.${index}.emailEnabled`)}
                      className="h-4 w-4 rounded border-slate-300 text-[#003377] focus:ring-[#FFC83D]"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Mail size={14} className="text-amber-500" />
                      {dict.notifications.prefEmail}
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quiet Hours Section */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
              <Moon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-google-sans">
                {dict.notifications.prefQuietHoursTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {dict.notifications.prefQuietHoursDesc}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("quietHoursEnabled")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003377]"></div>
          </label>
        </div>

        {fields && fields.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {dict.notifications.prefQuietStart}
              </label>
              <input
                type="time"
                {...register("quietHoursStart")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {dict.notifications.prefQuietEnd}
              </label>
              <input
                type="time"
                {...register("quietHoursEnd")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center min-w-[190px] h-[50px] gap-2 rounded-2xl bg-[#003377] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#003377]/20 hover:bg-[#002255] transition active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <Save size={18} />
          <span>{isSaving ? dict.notifications.prefSavingBtn : dict.notifications.prefSaveBtn}</span>
        </button>
      </div>
    </form>
  );
}
