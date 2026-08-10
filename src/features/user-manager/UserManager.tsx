"use client";

import { useMemo, useState } from "react";
import { Plus,ChevronLeft } from "lucide-react";
import Createuser from "@/features/dashboard/components/Createuser";
import UserTable from "@/features/dashboard/components/UserTable";
import { useRouter } from "next/navigation";


const sampleUsers = [
  {
    id: "1",
    name: "ចន អតិ",
    email: "chdara@gmail.com",
    role: "user",
    status: "active",
    lastActive: "2026-07-14",
  },
  {
    id: "2",
    name: "រដ្ឋា កា",
    email: "himnara@gmail.com",
    role: "user",
    status: "active",
    lastActive: "2026-07-13",
  },
  {
    id: "3",
    name: "សុវត្ថិ",
    email: "suvry@gmail.com",
    role: "admin",
    status: "active",
    lastActive: "2026-07-12",
  },
  {
    id: "4",
    name: "ឡេង កិច្ឆ"
    ,
    email: "markpio@gmail.com",
    role: "user",
    status: "inactive",
    lastActive: "2026-07-11",
  },
  {
    id: "5",
    name: "ឡៅ ថ៊ីដា",
    email: "lao.thida@gmail.com",
    role: "user",
    status: "active",
    lastActive: "2026-07-10",
  },
  {
    id: "6",
    name: "ពេជ្រ ចាន់",
    email: "pejr.chan@gmail.com",
    role: "user",
    status: "inactive",
    lastActive: "2026-07-09",
  },
];

export default function UserManagerPage() {
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();


  const filteredUsers = useMemo(
    () =>
      sampleUsers.filter((user) =>
        [user.name, user.email, user.role, user.status]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <div className="w-auto space-y-6">
      <div className="rounded-4xl   dark:slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
           
            <h1 className="mt-2 text-3xl font-bold text-[#003377] dark:text-white">
              គ្រប់គ្រងអ្នកប្រើ
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              6 នាក់
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center text-[#003377]">
            
            <button 
              type="button"
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-full  px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948] dark:bg-[#003377] dark:text-slate-300"
            >
              <ChevronLeft  size={18} /> Admin </button>

            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-[#003377] transition hover:bg-[#f7c948]"
            >
              <Plus size={18}/> បង្កើតថ្មី
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 text-[#003377]">
        <UserTable users={filteredUsers} />
      </div>

      <Createuser open={openCreate} onOpenChange={setOpenCreate} />
    </div>
  );
}
