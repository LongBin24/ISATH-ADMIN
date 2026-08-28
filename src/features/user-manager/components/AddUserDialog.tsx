"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Eye, EyeOff, KeyRound, LoaderCircle, Mail, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUserMutation } from "@/features/user-manager/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  temporaryPassword: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  role: "USER",
  temporaryPassword: "",
  confirmPassword: "",
};

const ROLE_LABEL: Record<FormState["role"], string> = {
  USER: "User",
  ADMIN: "Administrator",
};

export default function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const { t } = useAdminI18n();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [createUser, { isLoading }] = useCreateUserMutation();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function reset() {
    setForm(INITIAL_STATE);
    setErrors({});
    setShowTemporaryPassword(false);
    setShowConfirmPassword(false);
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.temporaryPassword.length < 8) next.temporaryPassword = "Must be at least 8 characters.";
    if (form.confirmPassword !== form.temporaryPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    try {
      await createUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        temporaryPassword: form.temporaryPassword,
        confirmPassword: form.confirmPassword,
        role: form.role,
      }).unwrap();
      toast.success("User created successfully.");
      reset();
      onOpenChange(false);
    } catch (err) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Unable to create user. Please try again.");
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
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-3xl overflow-hidden p-0" onClose={() => { reset(); onOpenChange(false); }}>
        <DialogHeader className="relative mb-0 border-b border-border/70 bg-gradient-to-r from-[#003377]/8 via-background to-[#FEDB55]/12 px-6 py-6 pr-14 sm:px-8">
          <div className="flex items-start gap-4 text-left">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#FEDB55] text-[#003377] shadow-sm">
              <UserPlus className="size-6" />
            </span>
            <div>
              <DialogTitle className="text-2xl">{t("Add New User")}</DialogTitle>
              <DialogDescription className="mt-1">{t("Create a new iStash account.")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-9rem)] overflow-y-auto">
          <div className="space-y-7 px-6 py-6 sm:px-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><UserRound className="size-5" /></span>
                <div><h3 className="text-lg font-semibold">{t("Account information")}</h3><p className="text-base text-muted-foreground">{t("Enter the user's basic details and access role.")}</p></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("First Name")} htmlFor="firstName" error={errors.firstName}>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    placeholder={t("Enter first name")}
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    aria-invalid={Boolean(errors.firstName)}
                    className="h-12 rounded-xl bg-background px-4 text-base"
                  />
                </Field>
                <Field label={t("Last Name")} htmlFor="lastName" error={errors.lastName}>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    placeholder={t("Enter last name")}
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    aria-invalid={Boolean(errors.lastName)}
                    className="h-12 rounded-xl bg-background px-4 text-base"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("Email")} htmlFor="email" error={errors.email}>
                  <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" /><Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} aria-invalid={Boolean(errors.email)} className="h-12 rounded-xl bg-background pl-12 pr-4 text-base" /></div>
                </Field>
                <Field label={t("Role")} htmlFor="role">
                  <Select className="w-full" value={form.role} onValueChange={(value) => update("role", value as FormState["role"])}>
                    <SelectTrigger id="role" className="h-12 w-full rounded-xl bg-background px-4 text-base">
                      <SelectValue value={t(ROLE_LABEL[form.role])} />
                    </SelectTrigger>
                    <SelectContent className="w-full min-w-full">
                      <SelectItem value="USER">{t("User")}</SelectItem>
                      <SelectItem value="ADMIN">{t("Administrator")}</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {form.role === "ADMIN" && <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-base text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><span>{t("Administrator accounts have elevated access to management features.")}</span></div>}
            </section>

            <section className="space-y-4 border-t border-border/70 pt-6">
              <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"><KeyRound className="size-5" /></span><div><h3 className="text-lg font-semibold">{t("Temporary password")}</h3><p className="text-base text-muted-foreground">{t("Set the credentials the user will use for their first sign in.")}</p></div></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("Temporary Password")} htmlFor="temporaryPassword" error={errors.temporaryPassword} helper={!errors.temporaryPassword ? t("Use at least 8 characters.") : undefined}>
                  <PasswordInput id="temporaryPassword" value={form.temporaryPassword} visible={showTemporaryPassword} onChange={(value) => update("temporaryPassword", value)} onToggle={() => setShowTemporaryPassword((value) => !value)} invalid={Boolean(errors.temporaryPassword)} showLabel={t("Show temporary password")} hideLabel={t("Hide temporary password")} />
                </Field>
                <Field label={t("Confirm Password")} htmlFor="confirmPassword" error={errors.confirmPassword}>
                  <PasswordInput id="confirmPassword" value={form.confirmPassword} visible={showConfirmPassword} onChange={(value) => update("confirmPassword", value)} onToggle={() => setShowConfirmPassword((value) => !value)} invalid={Boolean(errors.confirmPassword)} showLabel={t("Show confirmed password")} hideLabel={t("Hide confirmed password")} />
                </Field>
              </div>
            </section>
          </div>

          <DialogClose className="sticky bottom-0 mt-0 border-t border-border/70 bg-card/95 px-6 py-4 backdrop-blur sm:px-8">
            <Button type="button" variant="outline" className="h-11 min-w-28 rounded-xl text-base" onClick={() => { reset(); onOpenChange(false); }}>{t("Cancel")}</Button>
            <Button type="submit" disabled={isLoading} className="h-11 min-w-44 rounded-xl bg-[#FEDB55] px-5 text-base font-semibold text-[#003377] shadow-sm hover:bg-[#f0ba33]">
              {isLoading ? <LoaderCircle className="mr-2 size-5 animate-spin" /> : <ShieldCheck className="mr-2 size-5" />}{isLoading ? t("Creating...") : t("Create User")}
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, htmlFor, error, helper, children }: { label: string; htmlFor: string; error?: string; helper?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={htmlFor} className="text-base font-semibold">{label}</Label>{children}{error ? <p className="text-base text-destructive" role="alert">{error}</p> : helper ? <p className="text-base text-muted-foreground">{helper}</p> : null}</div>;
}

function PasswordInput({ id, value, visible, invalid, onChange, onToggle, showLabel, hideLabel }: { id: string; value: string; visible: boolean; invalid: boolean; onChange: (value: string) => void; onToggle: () => void; showLabel: string; hideLabel: string }) {
  return <div className="relative"><Input id={id} type={visible ? "text" : "password"} autoComplete="new-password" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={invalid} className="h-12 rounded-xl bg-background px-4 pr-12 text-base" /><button type="button" onClick={onToggle} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={visible ? hideLabel : showLabel}>{visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>;
}
