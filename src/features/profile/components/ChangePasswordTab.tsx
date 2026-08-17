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
import { changePasswordSchema, type ChangePasswordFormValues } from "../schema";

export default function ChangePasswordTab({ onSuccess, onError }: { onSuccess: (msg: string) => void; onError: (msg: string) => void }) {
  const { t } = useAdminI18n();
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

  async function submit(values: ChangePasswordFormValues) {
    try {
      const result = await changePassword({ ...values, passwordConfirmed: true }).unwrap();
      onSuccess(result.message || t("Password changed successfully."));
      reset();
    } catch (error) {
      const data = (error as { data?: { message?: string; error?: string } })?.data;
      onError(data?.message || data?.error || t("Unable to change password. Please try again."));
    }
  }

  return (
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
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit rounded-2xl shadow-sm">
        <CardHeader><CardTitle className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="size-5 text-[#003377] dark:text-[#FEDB55]" />{t("Password Requirements")}</CardTitle><CardDescription>{t("Use these guidelines to keep your administrator account secure.")}</CardDescription></CardHeader>
        <CardContent className="space-y-3">{rules.map((rule) => <div key={rule.label} className="flex items-center gap-3 rounded-xl border border-border bg-muted/25 p-3"><CheckCircle2 className={`size-5 shrink-0 ${rule.met ? "text-emerald-500" : "text-muted-foreground/50"}`} /><span className={`text-base ${rule.met ? "font-medium text-foreground" : "text-muted-foreground"}`}>{rule.label}</span></div>)}<div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">{t("After changing your password, use the new password the next time you sign in.")}</div></CardContent>
      </Card>
    </div>
  );
}

function PasswordField({ id, label, placeholder, visible, onToggle, error, registration }: { id: string; label: string; placeholder: string; visible: boolean; onToggle: () => void; error?: string; registration: UseFormRegisterReturn }) {
  return <div><Label htmlFor={id} className="text-base">{label} <span className="text-destructive">*</span></Label><div className="relative mt-2"><Input id={id} type={visible ? "text" : "password"} autoComplete="new-password" placeholder={placeholder} className={`h-11 rounded-xl pr-11 text-base ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`} {...registration} /><Button type="button" variant="ghost" size="icon" onClick={onToggle} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-lg text-muted-foreground" aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></div>{error && <p className="mt-2 flex items-center gap-1.5 text-sm text-destructive"><AlertCircle className="size-4" />{error}</p>}</div>;
}
