"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, ExternalLink, CheckCheck } from "lucide-react";
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../api";
import { useNotificationUI } from "../hook";
import Link from "next/link";
import { useI18n } from "@/hooks/use-i18n";

export default function NotificationBellDropdown() {
  const { dict, locale, isEnglish } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: stats } = useGetNotificationStatsQuery(undefined, { pollingInterval: 10000 });
  const { data: notifications = [] } = useGetNotificationsQuery(undefined, { pollingInterval: 10000 });
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const { selectNotification } = useNotificationUI();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = stats?.unreadCount || 0;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative font-google-sans" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D]"
        aria-label={dict.notifications.title}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC83D] text-[10px] font-bold text-[#003377] ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 font-google-sans">
          {/* Dropdown Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-850">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white font-google-sans">
                {dict.notifications.title}
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#FFC83D]/20 px-2 py-0.5 text-[11px] font-bold text-[#003377] dark:text-[#FFC83D]">
                  {unreadCount} {isEnglish ? "New" : "ថ្មី"}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="text-[11px] font-semibold text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D] flex items-center gap-1"
              >
                <CheckCheck size={14} />
                <span>{dict.notifications.markAllRead}</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {dict.notifications.noNotifications}
              </div>
            ) : (
              recentNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isRead) {
                      markAsRead(item.id);
                    }
                    selectNotification(item);
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${
                    !item.isRead ? "bg-amber-500/5" : ""
                  }`}
                >
                  <div className="relative mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#FFC83D]">
                    {!item.isRead && (
                      <span className="absolute inset-0 rounded-full bg-[#FFC83D] animate-ping" />
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {isEnglish ? item.title || item.titleKh : item.titleKh || item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {isEnglish ? item.message || item.messageKh : item.messageKh || item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-850">
            <Link
              href={`/${locale}/notifications`}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003377] hover:underline dark:text-[#FFC83D]"
            >
              <span>{dict.notifications.viewAll}</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
