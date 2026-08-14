"use client";

import React from "react";
import CurrencyTab from "@/features/profile/components/CurrencyTab";
import { useGetProfileQuery } from "@/features/profile/api";
import toast from "react-hot-toast";

export default function CurrencySettingsPage() {
  const { data: profile, isLoading } = useGetProfileQuery();

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3 font-google-sans">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFC83D] border-t-transparent" />
        <p className="text-sm font-semibold text-slate-500">កំពុងផ្ទុកការកំណត់រូបិយប័ណ្ណ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-google-sans max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-[#003377] dark:text-white">
          ការកំណត់រូបិយប័ណ្ណ
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          កំណត់រូបិយប័ណ្ណចំបងសម្រាប់ការបង្ហាញរបាយការណ៍ និងការគណនាហិរញ្ញវត្ថុ
        </p>
      </div>

      <CurrencyTab
        profile={profile}
        onSuccess={(msg) => toast.success(msg)}
        onError={(msg) => toast.error(msg)}
      />
    </div>
  );
}
