"use client";

import React, { useState } from "react";
import { UserNotificationSettings, UserProfile } from "../types";
import { useUpdateNotificationsMutation } from "../api";
import { Bell, Mail, ShieldAlert, Sparkles, Volume2, Calendar, RefreshCw, Save } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

interface NotificationTabProps {
  profile: UserProfile;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function NotificationTab({
  profile,
  onSuccess,
  onError,
}: NotificationTabProps) {
  const { dict, isEnglish } = useI18n();
  const [settings, setSettings] = useState<UserNotificationSettings>(
    profile.notifications
  );

  const [updateNotifications, { isLoading }] = useUpdateNotificationsMutation();

  const handleToggle = (key: keyof UserNotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await updateNotifications({ notifications: settings }).unwrap();
      onSuccess(dict.profile.notifSuccess);
    } catch (err) {
      onError(dict.profile.notifError);
    }
  };

  const items: {
    key: keyof UserNotificationSettings;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      key: "email",
      title: dict.profile.notifEmailTitle,
      desc: dict.profile.notifEmailDesc,
      icon: Mail,
    },
    {
      key: "push",
      title: dict.profile.notifPushTitle,
      desc: dict.profile.notifPushDesc,
      icon: Bell,
    },
    {
      key: "securityAlerts",
      title: dict.profile.notifSecurityTitle,
      desc: dict.profile.notifSecurityDesc,
      icon: ShieldAlert,
    },
    {
      key: "productUpdates",
      title: dict.profile.notifProductTitle,
      desc: dict.profile.notifProductDesc,
      icon: Sparkles,
    },
    {
      key: "weeklyReport",
      title: dict.profile.notifWeeklyTitle,
      desc: dict.profile.notifWeeklyDesc,
      icon: Calendar,
    },
    {
      key: "sound",
      title: dict.profile.notifSoundTitle,
      desc: dict.profile.notifSoundDesc,
      icon: Volume2,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 font-google-sans">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
          {dict.profile.notificationsTitle}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {dict.profile.notificationsSubtitle}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isChecked = settings?.[item.key] ?? false;
          
          return (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-slate-200 dark:border-slate-800 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-start gap-3.5 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#003377] dark:bg-slate-800 dark:text-[#FFC83D]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isChecked ? "bg-[#003377] dark:bg-[#FFC83D]" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isChecked ? "translate-x-5 bg-[#FFC83D] dark:bg-[#003377]" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow hover:bg-[#f0ba33] transition disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isLoading ? dict.profile.saving : dict.profile.notifSaveBtn}
        </button>
      </div>
    </div>
  );
}
