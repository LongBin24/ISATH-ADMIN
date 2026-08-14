"use client";

import { useState } from "react";
import { Plus, ChevronLeft, Users } from "lucide-react";
import Createuser from "@/features/dashboard/components/Createuser";
import UserTable from "@/features/dashboard/components/UserTable";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/features/users/api";
import { useI18n } from "@/hooks/use-i18n";

export default function UserManagerPage() {
  const { locale, dict } = useI18n();
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();

  const { data: realUsers = [], isLoading } = useGetUsersQuery();

  return (
    <div className="w-auto space-y-6 font-google-sans">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#003377] dark:text-white flex items-center gap-3">
              <Users className="size-8 text-[#FFC83D]" />
              {dict.users.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {dict.users.subtitle}: {realUsers.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="inline-flex min-w-[140px] h-[46px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#003377] transition hover:border-[#FFC83D] hover:bg-[#FFC83D] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D] dark:hover:text-[#003377] whitespace-nowrap shrink-0"
            >
              <ChevronLeft size={18} /> {dict.nav.dashboard}
            </button>

            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex min-w-[150px] h-[46px] items-center justify-center gap-2 rounded-full bg-[#FFC83D] px-5 py-2.5 text-sm font-bold text-[#003377] shadow-sm transition hover:bg-[#f5b91f] dark:bg-[#FFC83D] dark:text-[#003377] whitespace-nowrap shrink-0"
            >
              <Plus size={18} /> {dict.users.addUser}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">{dict.common.loading}</div>
        ) : (
          <UserTable users={realUsers} showSearch initialPageSize={10} />
        )}
      </div>

      <Createuser open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
