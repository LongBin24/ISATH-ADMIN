"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, ExternalLink, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../api";
import { useNotificationUI } from "../hook";
import { useAdminI18n } from "@/i18n/admin-i18n";
import Link from "next/link";

function safeRelativeTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, { addSuffix: true });
}

export default function NotificationBellDropdown() {
  const { t, locale } = useAdminI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const liveQueryOptions = {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  } as const;
  const { data: stats, refetch: refetchStats } = useGetNotificationStatsQuery(undefined, liveQueryOptions);
  const { data: notifications = [], refetch: refetchNotifications } = useGetNotificationsQuery(undefined, liveQueryOptions);
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

  useEffect(() => {
    if (!isOpen) return;
    refetchStats();
    refetchNotifications();
  }, [isOpen, refetchNotifications, refetchStats]);

  const unreadCount = stats?.unreadCount || 0;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative font-google-sans" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-xl border border-border bg-card p-2.5 text-foreground/80 transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
        aria-label={t("Notifications")}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            key={unreadCount}
            className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 animate-in zoom-in-75 items-center justify-center rounded-full bg-[#FFC83D] px-1 text-xs font-bold text-[#003377] ring-2 ring-background dark:ring-slate-900"
            aria-label={`${unreadCount} ${t("unread notifications")}`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 sm:w-96 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-200 font-google-sans">
          {/* Dropdown Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground dark:text-slate-100">
                {t("Notifications")}
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#003377]/10 px-2 py-0.5 text-xs font-bold text-[#003377] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]">
                  {unreadCount} {t("new")}
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#003377] dark:text-slate-400 dark:hover:text-[#FFC83D]"
              >
                <CheckCheck size={14} />
                <span>{t("Mark all as read")}</span>
              </button>
            )}
          </div>

          <div className="max-h-80 divide-y divide-border/60 overflow-y-auto dark:divide-slate-800">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground dark:text-slate-400">
                {t("No notifications yet")}
              </div>
            ) : (
              recentNotifications.map((item) => {
                const isUnread = !item.isRead && !item.read;
                const title =
                  locale === "km"
                    ? item.titleKh || t(item.title) || item.title
                    : item.titleEn || item.title || item.titleKh;
                const message =
                  locale === "km"
                    ? item.messageKh || t(item.message) || item.message
                    : item.messageEn || item.message || item.messageKh;
                const timeAgo = safeRelativeTime(item.createdAt);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (isUnread) {
                        markAsRead(item.id);
                      }
                      selectNotification(item);
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-muted/50 dark:hover:bg-slate-800/60 ${
                      isUnread
                        ? "bg-[#003377]/[0.03] dark:bg-[#FFC83D]/[0.05]"
                        : ""
                    }`}
                  >
                    <span className="relative mt-1.5 flex size-2 shrink-0 rounded-full bg-[#003377] dark:bg-[#FFC83D]">
                      {isUnread && (
                        <span className="absolute inset-0 rounded-full bg-[#003377] opacity-75 animate-ping dark:bg-[#FFC83D]" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`line-clamp-1 text-xs ${
                            isUnread
                              ? "font-bold text-foreground dark:text-slate-100"
                              : "font-medium text-foreground/90 dark:text-slate-300"
                          }`}
                        >
                          {title}
                        </p>
                        {timeAgo && (
                          <span className="shrink-0 text-[10px] text-muted-foreground dark:text-slate-400">
                            {timeAgo}
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground dark:text-slate-400">
                        {message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-border bg-muted/20 p-2.5 text-center dark:border-slate-800 dark:bg-slate-900/90">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-[#003377] transition hover:bg-[#003377]/5 dark:text-[#FFC83D] dark:hover:bg-[#FFC83D]/10"
            >
              <span>{t("View All Notifications")}</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
