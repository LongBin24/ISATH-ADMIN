"use client";

import { Users, CreditCard, CircleAlert } from "lucide-react";
import StatsCard from "./components/StatsCard";
import UserTable from "./components/UserTable";
import QuickMenu from "./components/QuickMenu";
import AIStatus from "./components/AIStatus";
import {
  useGetProcessSummaryQuery,
  useGetStatsQuery,
  useGetUserSummaryQuery,
  useGetInActiveSummaryQuery,
  useGetUsersQuery,
} from "./api";
import { useState } from "react";
import Createuser from "./components/Createuser";
import { SuccessModal } from "./components/UserModals";
import UserStatsModal from "./components/UserTotal";
import ProcessStatsModal from "./components/ProcessTotal";
import InActiveStatsModal from "./components/InActiveTotal";

export default function AdminDashboard() {
  const { data: stats } = useGetStatsQuery();
  const { data: realUsers = [] } = useGetUsersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isInActiveModalOpen, setInActiveModalOpen] = useState(false);
  const { data: userStats, isLoading: isUserStatsLoading } = useGetUserSummaryQuery();
  const { data: processStats, isLoading: isProcessStatsLoading } = useGetProcessSummaryQuery();
  const { data: inActiveStats, isLoading: isInActiveStatsLoading } = useGetInActiveSummaryQuery();

  return (
    <div className="flex flex-col gap-6 sm:gap-8 font-google-sans">
      <div className="rounded-3xle dark:bg-slate-900 dark:border dark:border-slate-800 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003377] dark:text-white">
            ផ្ទាំងគ្រប់គ្រង
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            គ្រប់គ្រងប្រព័ន្ធ iStash
          </p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="inline-flex items-center justify-center rounded-full bg-[#FFC83D] px-7 py-3 text-sm font-semibold text-[#003377] shadow-sm transition hover:bg-[#f7c948] dark:bg-[#FFC83D] dark:text-slate-950"
        >
          + បង្កើតថ្មី
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
        <StatsCard
          title="ប្រតិបត្តិការសរុប"
          value={stats?.totalProcess ?? 0}
          icon={CreditCard}
          color="#003377"
          onClick={() => setIsProcessModalOpen(true)}
        />
        <StatsCard
          title="អ្នកប្រើប្រាស់សរុប"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          color="#FFC83D"
          onClick={() => setIsModalOpen(true)}
        />
        <StatsCard
          title="មិនសកម្ម"
          value={stats?.inActiveUsers ?? 0}
          icon={CircleAlert}
          color="#ef4444"
          onClick={() => setInActiveModalOpen(true)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 sm:p-6">
          <h2 className="mb-6 text-xl font-bold text-[#003377] dark:text-white">
            អ្នកប្រើប្រាស់ថ្មី
          </h2>
          <UserTable users={realUsers} />
        </div>

        <div className="flex flex-col gap-6">
          <QuickMenu />
          <AIStatus />
        </div>
      </div>
      <InActiveStatsModal
        open={isInActiveModalOpen}
        onOpenChange={setInActiveModalOpen}
        data={inActiveStats}
        isLoading={isInActiveStatsLoading}
      />
      <ProcessStatsModal
        open={isProcessModalOpen}
        onOpenChange={setIsProcessModalOpen}
        data={processStats}
        isLoading={isProcessStatsLoading}
      />
      <UserStatsModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        data={userStats} 
        isLoading={isUserStatsLoading} 
      />
      <Createuser
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => setSuccessOpen(true)}
      />
      <SuccessModal
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
