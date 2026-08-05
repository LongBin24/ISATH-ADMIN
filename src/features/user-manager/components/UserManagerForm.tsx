"use client";

import { useState } from "react";
import { useCreateUserMutation } from "@/features/user-manager/api";
import { UserRole } from "@/features/user-manager/types";

export default function UserManagerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [message, setMessage] = useState<string | null>(null);
  const [createUser, { isLoading }] = useCreateUserMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setMessage("សូមបំពេញឈ្មោះ និងអ៊ីម៉ែល");
      return;
    }

    try {
      await createUser({ name, email, role } as any).unwrap();
      setName("");
      setEmail("");
      setRole("user");
      setMessage("បានបង្កើតអ្នកប្រើប្រាស់ដោយជោគជ័យ។");
    } catch (error) {
      console.error(error);
      setMessage("មានបញ្ហាក្នុងការបង្កើតអ្នកប្រើប្រាស់។ សូមព្យាយាមម្ដងទៀត។");
    }
  }

  return (
    <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[#003377]/70">
          User Manager
        </p>
        <h2 className="text-3xl font-bold text-[#003377] dark:text-white">
          គ្រប់គ្រងអ្នកប្រើប្រាស់
        </h2>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          បំពេញព័ត៌មានខាងក្រោមដើម្បីបង្កើតអ្នកប្រើប្រាស់ថ្មី។
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
            <span>ឈ្មោះ</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="ឈ្មោះ"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <span>អ៊ីម៉ែល</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="user@gmail.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>
        </div>

        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
          <p>តួនាទី</p>
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
            {(["user", "admin"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  role === item
                    ? "bg-[#FFC83D] text-[#003377]"
                    : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {item === "user" ? "User" : "Admin"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#FFC83D] px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isLoading ? "កំពុងរក្សាទុក..." : "+ បង្កើតអ្នកប្រើប្រាស់"}
          </button>
        </div>
      </form>
    </div>
  );
}
