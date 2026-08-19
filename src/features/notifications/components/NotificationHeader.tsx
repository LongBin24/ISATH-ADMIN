"use client";

import React from "react";
import { Bell, Sparkles, RefreshCw, Send, CheckCheck } from "lucide-react";
import {
  useGetNotificationStatsQuery,
  useMarkAllAsReadMutation,
  useResetNotificationsMutation,
} from "../api";
import { useNotificationUI } from "../hook";
import { useI18n } from "@/hooks/use-i18n";

export default function NotificationHeader() {
  const { dict } = useI18n();
  const { data: stats } = useGetNotificationStatsQuery();
  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();
  const [resetNotifications, { isLoading: isResetting }] =
    useResetNotificationsMutation();
  const { toggleTriggerModal } = useNotificationUI();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003377] via-[#002255] to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-700/50">
      {/* Background Decorative Elements */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#FFC83D]/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-12 h-48 w-48 rounded-full bg-[#003377]/30 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Subtitle */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFC83D]/20 px-3 py-1 text-xs font-semibold text-[#FFC83D] backdrop-blur-md border border-[#FFC83D]/30">
            <Sparkles size={14} className="animate-pulse" />
            <span>{dict.notifications.automatedSystem}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-google-sans">
            {dict.notifications.financialSystem}{" "}
            <span className="text-[#FFC83D]">iStash</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-google-sans">
            {dict.notifications.bannerDescription}
          </p>
        </div>

        {/* Quick Stats & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Stats Badge */}
          <div className="flex items-center gap-3 rounded-2xl bg-slate-800/80 p-3 backdrop-blur-md border border-slate-700 min-w-[130px] h-[52px]">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFC83D] text-[#003377]">
              <Bell size={20} />
              {stats && stats.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {stats.unreadCount}
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400">{dict.notifications.unread}</p>
              <p className="text-lg font-bold text-white leading-none">
                {stats?.unreadCount || 0}{" "}
                <span className="text-xs text-slate-400">
                  / {stats?.total || 0}
                </span>
              </p>
            </div>
          </div>

          {/* Trigger Alert Button */}
          <button
            type="button"
            onClick={() => toggleTriggerModal(true)}
            className="flex items-center justify-center min-w-[190px] h-[52px] gap-2 rounded-2xl bg-[#FFC83D] px-5 py-3 text-sm font-bold text-[#003377] shadow-lg shadow-[#FFC83D]/20 transition hover:bg-[#e0ac2b] active:scale-95 whitespace-nowrap shrink-0"
          >
            <Send size={16} />
            <span>{dict.notifications.createNotification}</span>
          </button>

          {/* Mark All Read Button */}
          {stats && stats.unreadCount > 0 && (
            <button
              type="button"
              disabled={isMarking}
              onClick={() => markAllAsRead()}
              className="flex items-center justify-center min-w-[140px] h-[52px] gap-1.5 rounded-2xl bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 border border-white/10 whitespace-nowrap shrink-0"
              title={dict.notifications.markAllRead}
            >
              <CheckCheck size={16} />
              <span className="hidden sm:inline">{dict.notifications.markAllRead}</span>
            </button>
          )}

          {/* Reset Demo Data Button */}
          <button
            type="button"
            disabled={isResetting}
            onClick={() => resetNotifications()}
            className="flex items-center justify-center h-[52px] w-[52px] rounded-2xl bg-slate-800/80 p-3 text-slate-300 hover:text-white transition hover:bg-slate-700 border border-slate-700 shrink-0"
            title={dict.notifications.reset}
          >
            <RefreshCw
              size={16}
              className={isResetting ? "animate-spin text-[#FFC83D]" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
