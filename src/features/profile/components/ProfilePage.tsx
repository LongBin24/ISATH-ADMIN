"use client";

import React, { useState } from "react";
import { useGetProfileQuery } from "../api";
import ProfileBanner from "./ProfileBanner";
import ProfileNavTabs, { ProfileTabKey } from "./ProfileNavTabs";
import ProfileOverviewTab from "./ProfileOverviewTab";
import EditProfileTab from "./EditProfileTab";
import ChangePasswordTab from "./ChangePasswordTab";
import CurrencyTab from "./CurrencyTab";
import NotificationTab from "./NotificationTab";
import KhmerToast from "./KhmerToast";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();

  const [activeTab, setActiveTab] = useState<ProfileTabKey>("overview");
  const [toast, setToast] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({
    type: null,
    message: null,
  });

  const showSuccess = (msg: string) => {
    setToast({ type: "success", message: msg });
  };

  const showError = (msg: string) => {
    setToast({ type: "error", message: msg });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003377] text-[#FFC83D] shadow-lg animate-bounce">
          <RefreshCw className="h-7 w-7 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-google-sans">
          កំពុងទាញយកព័ត៌មានគណនី...
        </p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="max-w-md font-google-sans">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            មិនអាចទាញយកព័ត៌មានគណនីបានទេ
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ម៉ាស៊ីនបម្រើ សូមពិនិត្យមើលអ៊ីនធឺណិត ឬព្យាយាមម្តងទៀត។
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-xl bg-[#003377] px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-[#002255] transition font-google-sans"
        >
          <RefreshCw className="h-4 w-4" />
          ព្យាយាមម្តងទៀត
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 font-google-sans">
      {/* Toast Feedback */}
      <KhmerToast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: null, message: null })}
      />

      {/* Profile Header Banner */}
      <ProfileBanner
        profile={profile}
        onSuccess={showSuccess}
        onError={showError}
      />

      {/* Navigation Tabs */}
      <ProfileNavTabs
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Tab Body */}
      <div className="transition-all duration-300">
        {activeTab === "overview" && (
          <ProfileOverviewTab
            profile={profile}
            onEditClick={() => setActiveTab("edit")}
          />
        )}

        {activeTab === "edit" && (
          <EditProfileTab
            profile={profile}
            onSuccess={showSuccess}
            onError={showError}
          />
        )}

        {activeTab === "password" && (
          <ChangePasswordTab
            onSuccess={showSuccess}
            onError={showError}
          />
        )}

        {activeTab === "currency" && (
          <CurrencyTab
            profile={profile}
            onSuccess={showSuccess}
            onError={showError}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationTab
            profile={profile}
            onSuccess={showSuccess}
            onError={showError}
          />
        )}
      </div>
    </div>
  );
}
