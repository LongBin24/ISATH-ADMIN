"use client";

import React from "react";
import NotificationHeader from "@/features/notifications/components/NotificationHeader";
import InAppNotificationFeed from "@/features/notifications/components/InAppNotificationFeed";
import EmailTemplatePreview from "@/features/notifications/components/EmailTemplatePreview";
import NotificationPreferencesForm from "@/features/notifications/components/NotificationPreferencesForm";
import NotificationDetailModal from "@/features/notifications/components/NotificationDetailModal";
import SendNotificationDialog from "@/features/notifications/components/SendNotificationDialog";
import { useNotificationUI } from "@/features/notifications/hook";
import { Bell, Mail, Settings } from "lucide-react";

export default function NotificationsPage() {
  const { activeTab, changeTab } = useNotificationUI();

  return (
    <div className="space-y-6 pb-12 font-google-sans">
      {/* 1. Top Banner Header */}
      <NotificationHeader />

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => changeTab("in-app")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition shadow-xs ${
            activeTab === "in-app"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
          }`}
        >
          <Bell size={18} />
          <span>ការជូនដំណឹងក្នុងកម្មវិធី</span>
        </button>

        <button
          type="button"
          onClick={() => changeTab("email-preview")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition shadow-xs ${
            activeTab === "email-preview"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
          }`}
        >
          <Mail size={18} />
          <span>គំរូអ៊ីមែល</span>
        </button>

        <button
          type="button"
          onClick={() => changeTab("preferences")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition shadow-xs ${
            activeTab === "preferences"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
          }`}
        >
          <Settings size={18} />
          <span>ការកំណត់ប្រព័ន្ធជូនដំណឹង</span>
        </button>
      </div>

      {/* 3. Main Content Views */}
      <div className="pt-2">
        {activeTab === "in-app" && <InAppNotificationFeed />}
        {activeTab === "email-preview" && <EmailTemplatePreview />}
        {activeTab === "preferences" && <NotificationPreferencesForm />}
      </div>

      {/* 4. Popups & Dialog Modals */}
      <NotificationDetailModal />
      <SendNotificationDialog />

    </div>
  );
}
