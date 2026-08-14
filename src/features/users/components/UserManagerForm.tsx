"use client";

import { useState } from "react";
import { useCreateUserMutation } from "@/features/users/api";
import { UserRole } from "@/features/users/types";
import { UserCheck } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

export default function UserManagerForm() {
  const { dict, isEnglish } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const role: UserRole = "user";
  const [message, setMessage] = useState<string | null>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setMessage(dict.users.fillNameAndEmail);
      return;
    }

    try {
      await createUser({ name, email, role }).unwrap();
      setName("");
      setEmail("");
      setMessage(dict.users.userCreatedSuccess);
    } catch (error) {
      console.error(error);
      setMessage(dict.users.userCreateError);
    }
  }

  return (
    <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 font-google-sans">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-normal text-[#003377]/70 dark:text-[#FFC83D]">
          {dict.users.title}
        </p>
        <h2 className="text-3xl font-bold text-[#003377] dark:text-white">
          {dict.users.title}
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          {isEnglish
            ? "Fill in the information below to create a new user account."
            : "បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតអ្នកប្រើប្រាស់ថ្មី។"}
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>{dict.users.name}</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={dict.users.enterNamePlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#003377] outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>{dict.users.email}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={dict.users.enterEmailPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <p>{dict.users.role}</p>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <UserCheck className="size-4 text-emerald-600" />
            <span>{dict.users.userRoleName}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{dict.users.adminRoleNotice}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#FFC83D] px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isLoading ? dict.users.creatingUser : dict.users.createUserButton}
          </button>
        </div>
      </form>
    </div>
  );
}
