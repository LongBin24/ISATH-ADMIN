"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X, UserCheck, Eye, EyeOff } from "lucide-react";
import { useCreateUserMutation } from "../api";

export default function Createuser({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const role = "USER"; // Fixed: Admin can only create User accounts
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [createUser] = useCreateUserMutation();

  function reset() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setTemporaryPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    if (temporaryPassword.length < 8) {
      setErrorMessage("ពាក្យសម្ងាត់បណ្តោះអាសន្នត្រូវមានយ៉ាងហោចណាស់ ៨ តួអក្សរ");
      return;
    }
    if (temporaryPassword !== confirmPassword) {
      setErrorMessage("ពាក្យសម្ងាត់ និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នាឡើយ");
      return;
    }

    setCreating(true);
    try {
      await createUser({
        firstName,
        lastName,
        email,
        temporaryPassword,
        confirmPassword,
        role,
      }).unwrap();
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string; error?: string }; status?: number };
      const message =
        apiError.data?.message ||
        apiError.data?.error ||
        `មិនអាចបង្កើតអ្នកប្រើប្រាស់បានទេ${apiError.status ? ` (កូដ ${apiError.status})` : ""}.`;
      setErrorMessage(message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-3xl p-0 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 font-google-sans">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <DialogTitle className="text-lg font-bold text-[#003377] dark:text-white">
              បង្កើតអ្នកប្រើប្រាស់
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {errorMessage && (
              <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                {errorMessage}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-500 mb-2">នាមត្រកូល</label>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="នាមត្រកូល"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-500 mb-2">នាមខ្លួន</label>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="នាមខ្លួន"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">
                អ៊ីម៉ែល
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@gmail.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">ពាក្យសម្ងាត់បណ្តោះអាសន្ន</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={temporaryPassword}
                  onChange={(event) => setTemporaryPassword(event.target.value)}
                  placeholder="យ៉ាងហោចណាស់ ៨ តួអក្សរ"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-500">តួនាទី</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <UserCheck className="size-4 text-emerald-600" />
                <span>អ្នកប្រើប្រាស់</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">អ្នកគ្រប់គ្រងអាចបង្កើតបានតែគណនីអ្នកប្រើប្រាស់ប៉ុណ្ណោះ</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                បិទ
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 rounded-full bg-[#FFC83D] py-3 text-sm font-semibold text-[#003377] hover:bg-[#f7c948] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating ? "កំពុងបង្កើត..." : "+ បង្កើតអ្នកប្រើប្រាស់"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
