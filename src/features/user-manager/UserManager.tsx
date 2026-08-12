"use client";

import { useState } from "react";
import { Plus, ChevronLeft, Users } from "lucide-react";
import Createuser from "@/features/dashboard/components/Createuser";
import UserTable from "@/features/dashboard/components/UserTable";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/features/user-manager/api";

export default function UserManagerPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();

  const { data: realUsers = [], isLoading } = useGetUsersQuery();

  return (
    <div className="w-auto space-y-6 font-google-sans">
      <div className="rounded-4xl dark:slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-bold text-[#003377] dark:text-white flex items-center gap-3">
              <Users className="size-8 text-[#FFC83D]" />
              គ្រប់គ្រងអ្នកប្រើប្រាស់
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              សរុបមាន {realUsers.length} នាក់ក្នុងប្រព័ន្ធ
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center text-[#003377]">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948] dark:bg-[#003377] dark:text-slate-300"
            >
              <ChevronLeft size={18} /> ផ្ទាំងគ្រប់គ្រង
            </button>

            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC83D] px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948]"
            >
              <Plus size={18} /> បង្កើតថ្មី
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-[#003377]">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">កំពុងទាញយកទិន្នន័យ...</div>
        ) : (
          <UserTable users={realUsers} showSearch initialPageSize={10} />
        )}
      </div>

      <Createuser open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
