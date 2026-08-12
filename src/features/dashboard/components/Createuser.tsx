"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X, UserCheck } from "lucide-react";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const role = "user"; // Fixed: Admin can only create User accounts
  const [creating, setCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [createUser] = useCreateUserMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setCreating(true);
    setErrorMessage("");
    try {
      await createUser({ name, email, role }).unwrap();
      setName("");
      setEmail("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const apiError = error as { data?: unknown; error?: string; status?: number };
      const message =
        typeof apiError.data === "string"
          ? apiError.data
          : apiError.error || `មិនអាចបង្កើតអ្នកប្រើប្រាស់បានទេ${apiError.status ? ` (កូដ ${apiError.status})` : ""}.`;
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
            <div>
              <label className="block text-sm text-slate-500 mb-2">ឈ្មោះ</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ឈ្មោះអ្នកប្រើប្រាស់"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
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
