"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormValues } from "../schema";
import { useChangePasswordMutation } from "../api";
import { KeyRound, Eye, EyeOff, Lock, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface ChangePasswordTabProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ChangePasswordTab({
  onSuccess,
  onError,
}: ChangePasswordTabProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordVal = watch("newPassword", "");

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "គ្មាន", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: "ទន់ខ្សោយ", color: "bg-rose-500" };
    if (score === 2) return { score: 50, label: "មធ្យម", color: "bg-amber-500" };
    if (score === 3) return { score: 75, label: "ល្អ", color: "bg-blue-500" };
    return { score: 100, label: "រឹងមាំខ្លាំង", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPasswordVal);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const res = await changePassword(values).unwrap();
      onSuccess(res.message || "បានផ្លាស់ប្តូរពាក្យសម្ងាត់បានជោគជ័យ!");
      reset();
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.error || "មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ (សូមពិនិត្យពាក្យសម្ងាត់បច្ចុប្បន្ន)";
      onError(msg);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-2xl font-google-sans">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
          ផ្លាស់ប្តូរពាក្យសម្ងាត់
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ដើម្បីការពារគណនីរបស់អ្នក សូមជ្រើសរើសពាក្យសម្ងាត់ដែលមានសុវត្ថិភាព និងមានយ៉ាងហោចណាស់ ៨ តួអក្សរ
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            ពាក្យសម្ងាត់បច្ចុប្បន្ន <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              placeholder="បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន..."
              className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.currentPassword
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <KeyRound className="h-3.5 w-3.5 text-slate-400" />
            ពាក្យសម្ងាត់ថ្មី <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី..."
              className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.newPassword
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.newPassword.message}
            </p>
          )}

          {/* Password Strength Meter */}
          {newPasswordVal && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">កម្រិតសុវត្ថិភាពពាក្យសម្ងាត់៖</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            បញ្ជាក់ពាក្យសម្ងាត់ថ្មី <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត..."
              className={`w-full rounded-xl border px-3.5 py-2.5 pr-10 text-sm transition outline-none dark:bg-slate-950 dark:text-white ${
                errors.confirmPassword
                  ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-slate-200 focus:border-[#003377] focus:ring-1 focus:ring-[#003377] dark:border-slate-800"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Requirements List */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 text-xs space-y-1 text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
            លក្ខខណ្ឌពាក្យសម្ងាត់៖
          </p>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${newPasswordVal.length >= 8 ? "text-emerald-500" : "text-slate-400"}`} />
            <span>យ៉ាងហោចណាស់ ៨ តួអក្សរ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${/[A-Z]/.test(newPasswordVal) ? "text-emerald-500" : "text-slate-400"}`} />
            <span>មានអក្សរធំយ៉ាងហោចណាស់ ១</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${/[0-9]/.test(newPasswordVal) ? "text-emerald-500" : "text-slate-400"}`} />
            <span>មានលេខយ៉ាងហោចណាស់ ១</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-[#003377] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#002255] transition disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4 text-[#FFC83D]" />
            )}
            ផ្លាស់ប្តូរពាក្យសម្ងាត់
          </button>
        </div>
      </form>
    </div>
  );
}
