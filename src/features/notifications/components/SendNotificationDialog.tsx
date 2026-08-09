"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Send, AlertCircle, Sparkles } from "lucide-react";
import {
  triggerNotificationSchema,
  TriggerNotificationFormData,
} from "../types";
import { useTriggerNotificationMutation } from "../api";
import { useNotificationUI } from "../hook";
import { CATEGORY_CONFIGS } from "../constants";

export default function SendNotificationDialog() {
  const { isTriggerModalOpen, toggleTriggerModal } = useNotificationUI();
  const [triggerNotification, { isLoading }] = useTriggerNotificationMutation();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

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
      customTitleKh: "ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃ!",
      customMessageKh: "សូមចំណាយពេល 1 នាទីដើម្បីកត់ត្រាប្រតិបត្តិការចំណាយរបស់អ្នកសម្រាប់ថ្ងៃនេះ។",
      priority: "MEDIUM",
      amount: 50,
      targetName: "",
    },
  });

  const selectedCategory = watch("category");

  // Auto-fill template suggestion on category change
  useEffect(() => {
    switch (selectedCategory) {
      case "DAILY_EXPENSE":
        setValue("customTitleKh", "ដល់ម៉ោងកត់ត្រាការចំណាយប្រចាំថ្ងៃ!");
        setValue(
          "customMessageKh",
          "សូមចំណាយពេល 1 នាទីដើម្បីកត់ត្រាប្រតិបត្តិការចំណាយរបស់អ្នកសម្រាប់ថ្ងៃនេះ។"
        );
        setValue("priority", "MEDIUM");
        break;
      case "BUDGET_WARNING":
        setValue("customTitleKh", "ការព្រមាន៖ ការចំណាយលើ «អាហារ» ជិតដល់កម្រិតកំណត់!");
        setValue(
          "customMessageKh",
          "អ្នកបានចំណាយ 85% នៃថវិកាប្រចាំខែដែលបានកំណត់ចំនួន $400.00 ក្នុងខែនេះហើយ។"
        );
        setValue("priority", "HIGH");
        setValue("amount", 340);
        break;
      case "SAVINGS_GOAL":
        setValue("customTitleKh", "អបអរសាទរ! គោលដៅសន្សំសម្រេចបាន 75%");
        setValue(
          "customMessageKh",
          "អ្នកបានសន្សំប្រាក់បាន $750.00 នៃគោលដៅសរុប $1,000.00។"
        );
        setValue("priority", "MEDIUM");
        setValue("targetName", "មូលនិធិអាសន្ន");
        break;
      case "RECURRING_TX":
        setValue("customTitleKh", "ការរំលឹកបង់ប្រាក់៖ វិក្កយបត្រត្រូវបង់នៅថ្ងៃស្អែក");
        setValue(
          "customMessageKh",
          "វិក្កយបត្រប្រចាំខែសេវាអ៊ីនធឺណិតចំនួន $35.00 នឹងត្រូវទូទាត់នៅថ្ងៃស្អែក។"
        );
        setValue("priority", "HIGH");
        setValue("amount", 35);
        break;
      case "MONTHLY_SUMMARY":
        setValue("customTitleKh", "របាយការណ៍ហិរញ្ញវត្ថុសង្ខេបប្រចាំខែកក្កដា");
        setValue(
          "customMessageKh",
          "ចំណូលសរុប $2,450.00, ចំណាយសរុប $1,280.00, សន្សំសុទ្ធ $1,170.00។"
        );
        setValue("priority", "LOW");
        setValue("amount", 1170);
        break;
    }
  }, [selectedCategory, setValue]);

  if (!isTriggerModalOpen) return null;

  const onSubmit = async (data: TriggerNotificationFormData) => {
    setSubmitError(null);
    try {
      const payload: TriggerNotificationFormData = {
        ...data,
        amount: typeof data.amount === "number" && !isNaN(data.amount) ? data.amount : undefined,
      };
      await triggerNotification(payload).unwrap();
      toggleTriggerModal(false);
      reset();
    } catch (e: any) {
      setSubmitError(e?.data?.message || e?.message || "មិនអាចផ្ញើការជូនដំណឹងបានទេ សូមព្យាយាមម្តងទៀត");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 font-google-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#003377] px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="text-[#FFC83D]" size={20} />
            <h3 className="text-base font-bold font-google-sans">
              បង្កើត និងផ្ញើការជូនដំណឹងសាកល្បង
            </h3>
          </div>
          <button
            type="button"
            onClick={() => toggleTriggerModal(false)}
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 font-google-sans">
          {submitError && (
            <div className="flex items-center gap-2 rounded-2xl bg-red-500/10 p-3 text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/30">
              <AlertCircle size={16} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              ប្រភេទការជូនដំណឹង
            </label>
            <select
              {...register("category")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#FFC83D] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {Object.values(CATEGORY_CONFIGS).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameKh}
                </option>
              ))}
            </select>
          </div>

          {/* Channel Select */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                ប៉ុស្តិ៍ផ្ញើ
              </label>
              <select
                {...register("channel")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="BOTH">ទាំងពីរ (ក្នុងកម្មវិធី និងអ៊ីមែល)</option>
                <option value="IN_APP">តែក្នុងកម្មវិធីប៉ុណ្ណោះ</option>
                <option value="EMAIL">តែអ៊ីមែលប៉ុណ្ណោះ</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                កម្រិតអាទិភាព
              </label>
              <select
                {...register("priority")}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="LOW">ទាប</option>
                <option value="MEDIUM">មធ្យម</option>
                <option value="HIGH">ខ្ពស់</option>
                <option value="URGENT">បន្ទាន់</option>
              </select>
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              ចំណងជើង
            </label>
            <input
              type="text"
              {...register("customTitleKh")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="បញ្ចូលចំណងជើង..."
            />
            {errors.customTitleKh && (
              <p className="text-[11px] font-bold text-red-500">{errors.customTitleKh.message}</p>
            )}
          </div>

          {/* Message Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              ខ្លឹមសារសារ
            </label>
            <textarea
              rows={3}
              {...register("customMessageKh")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="បញ្ចូលខ្លឹមសារសារ..."
            />
            {errors.customMessageKh && (
              <p className="text-[11px] font-bold text-red-500">{errors.customMessageKh.message}</p>
            )}
          </div>

          {/* Optional Amount */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              ចំនួនទឹកប្រាក់ ($) - បើមាន
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount", {
                setValueAs: (v) => (v === "" || v === null || isNaN(Number(v)) ? undefined : Number(v)),
              })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              placeholder="0.00"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => toggleTriggerModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-[#003377] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] transition active:scale-95 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{isLoading ? "កំពុងផ្ញើ..." : "ផ្ញើការជូនដំណឹង"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
