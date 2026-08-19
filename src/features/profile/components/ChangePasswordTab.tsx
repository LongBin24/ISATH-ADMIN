"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useChangePasswordMutation } from "../api";
<<<<<<< HEAD
import { changePasswordSchema, type ChangePasswordFormValues } from "../schema";

export default function ChangePasswordTab({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const { t } = useAdminI18n();
=======
import { KeyRound, Eye, EyeOff, Lock, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface ChangePasswordTabProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function ChangePasswordTab({
  onSuccess,
  onError,
}: ChangePasswordTabProps) {
  const { dict, isEnglish } = useI18n();
  const [showCurrent, setShowCurrent] = useState(false);
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { newPassword: "", confirmPassword: "" } });
  const password = useWatch({ control, name: "newPassword", defaultValue: "" });
  const rules = [
    { label: t("At least 8 characters"), met: password.length >= 8 },
    { label: t("At least one uppercase letter"), met: /[A-Z]/.test(password) },
    { label: t("At least one number"), met: /[0-9]/.test(password) },
    { label: t("At least one special character"), met: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = rules.filter((rule) => rule.met).length;
  const strength = score <= 1 ? { label: t("Weak"), width: 25, color: "bg-rose-500" } : score === 2 ? { label: t("Fair"), width: 50, color: "bg-amber-500" } : score === 3 ? { label: t("Good"), width: 75, color: "bg-blue-500" } : { label: t("Strong"), width: 100, color: "bg-emerald-500" };

<<<<<<< HEAD
  async function submit(values: ChangePasswordFormValues) {
    try {
      const result = await changePassword({ ...values, passwordConfirmed: true }).unwrap();
      onSuccess(result.message || t("Password changed successfully."));
      reset();
    } catch (error) {
      const data = (error as { data?: { message?: string; error?: string } })?.data;
      onError(data?.message || data?.error || t("Unable to change password. Please try again."));
=======
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
    if (!pwd) return { score: 0, label: dict.profile.strengthNone, color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: dict.profile.strengthWeak, color: "bg-rose-500" };
    if (score === 2) return { score: 50, label: dict.profile.strengthMedium, color: "bg-amber-500" };
    if (score === 3) return { score: 75, label: dict.profile.strengthGood, color: "bg-blue-500" };
    return { score: 100, label: dict.profile.strengthStrong, color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(newPasswordVal);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      const res = await changePassword(values).unwrap();
      onSuccess(res.message || dict.profile.passwordSuccess);
      reset();
    } catch (err: any) {
      const msg = err?.data?.message || err?.data?.error || dict.profile.passwordError;
      onError(msg);
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
    }
  }

  return (
<<<<<<< HEAD
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] font-google-sans">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FEDB55]/10 dark:text-[#FEDB55]"><KeyRound className="size-5" /></span><div><CardTitle className="text-xl font-bold">{t("Change Password")}</CardTitle><CardDescription className="mt-1">{t("Choose a strong password that you do not use for another account.")}</CardDescription></div></div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            <PasswordField id="new-password" label={t("New Password")} placeholder={t("Enter your new password")} visible={showNew} onToggle={() => setShowNew((current) => !current)} error={errors.newPassword?.message} registration={register("newPassword")} />

            {password && <div className="rounded-xl border border-border bg-muted/30 p-4"><div className="flex items-center justify-between gap-4 text-sm"><span className="text-muted-foreground">{t("Password strength")}</span><span className="font-semibold">{strength.label}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.width}%` }} /></div></div>}

            <PasswordField id="confirm-password" label={t("Confirm New Password")} placeholder={t("Enter the new password again")} visible={showConfirm} onToggle={() => setShowConfirm((current) => !current)} error={errors.confirmPassword?.message} registration={register("confirmPassword")} />

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" className="h-11 rounded-xl" disabled={!isDirty || isLoading} onClick={() => reset()}>{t("Reset")}</Button>
              <Button type="submit" className="h-11 rounded-xl bg-[#FEDB55] px-6 text-[#003377] hover:bg-[#f0ca43]" disabled={isLoading}>{isLoading ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <KeyRound className="mr-2 size-4" />}{isLoading ? t("Updating...") : t("Change Password")}</Button>
=======
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-2xl font-google-sans">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
          {dict.profile.passwordTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {dict.profile.passwordSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            {dict.profile.currentPassword} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              {...register("currentPassword")}
              placeholder={dict.profile.enterCurrentPassword}
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
            {dict.profile.newPassword} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              placeholder={dict.profile.enterNewPassword}
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
                <span className="text-slate-500">{dict.profile.passwordStrength}</span>
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
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            </div>
          </form>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <Card className="h-fit rounded-2xl shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5 text-[#003377] dark:text-[#FEDB55]" />{t("Password Requirements")}</CardTitle><CardDescription>{t("Use these guidelines to keep your administrator account secure.")}</CardDescription></CardHeader>
        <CardContent className="space-y-3">{rules.map((rule) => <div key={rule.label} className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 p-3"><CheckCircle2 className={`size-5 shrink-0 ${rule.met ? "text-emerald-500" : "text-muted-foreground/50"}`} /><span className={`text-base ${rule.met ? "font-medium text-foreground" : "text-muted-foreground"}`}>{rule.label}</span></div>)}<div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">{t("After changing your password, use the new password the next time you sign in.")}</div></CardContent>
      </Card>
=======
        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            {dict.profile.confirmPassword} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder={dict.profile.enterConfirmPassword}
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
            {isEnglish ? "Password Requirements:" : "លក្ខខណ្ឌពាក្យសម្ងាត់៖"}
          </p>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${newPasswordVal.length >= 8 ? "text-emerald-500" : "text-slate-400"}`} />
            <span>{isEnglish ? "At least 8 characters" : "យ៉ាងហោចណាស់ ៨ តួអក្សរ"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${/[A-Z]/.test(newPasswordVal) ? "text-emerald-500" : "text-slate-400"}`} />
            <span>{isEnglish ? "At least 1 uppercase letter (A-Z)" : "មានអក្សរធំយ៉ាងហោចណាស់ ១"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`h-3.5 w-3.5 ${/[0-9]/.test(newPasswordVal) ? "text-emerald-500" : "text-slate-400"}`} />
            <span>{isEnglish ? "At least 1 number (0-9)" : "មានលេខយ៉ាងហោចណាស់ ១"}</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-[#003377] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#002255] transition disabled:opacity-50 dark:bg-[#FFC83D] dark:text-[#003377]"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4 text-[#FFC83D] dark:text-[#003377]" />
            )}
            {isLoading ? dict.profile.updatingPassword : dict.profile.changePasswordBtn}
          </button>
        </div>
      </form>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
    </div>
  );
}

function PasswordField({ id, label, placeholder, visible, onToggle, error, registration }: { id: string; label: string; placeholder: string; visible: boolean; onToggle: () => void; error?: string; registration: UseFormRegisterReturn }) {
  return <div><Label htmlFor={id} className="text-base">{label} <span className="text-destructive">*</span></Label><div className="relative mt-2"><Input id={id} type={visible ? "text" : "password"} autoComplete="new-password" placeholder={placeholder} className={`h-11 rounded-xl pr-11 text-base ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`} {...registration} /><Button type="button" variant="ghost" size="icon" onClick={onToggle} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></div>{error && <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="size-4" />{error}</p>}</div>;
}
