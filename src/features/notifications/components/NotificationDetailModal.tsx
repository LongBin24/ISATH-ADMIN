"use client";

import React, { useState } from "react";
import { X, Calendar, ExternalLink, Wallet, AlertTriangle, Target, Repeat, BarChart3, Mail, Bell, RotateCcw, Check, RefreshCw } from "lucide-react";
import { useNotificationUI } from "../hook";
import { CATEGORY_CONFIGS } from "../constants";
import { useRetryNotificationDeliveryMutation, useGetAdminNotificationByIdQuery } from "../api";
import { useI18n } from "@/hooks/use-i18n";

export default function NotificationDetailModal() {
  const { dict, isEnglish } = useI18n();
  const { selectedNotification, isDetailModalOpen, dismissDetailModal } = useNotificationUI();
  const notificationId = selectedNotification?.id ?? "";
  const { data: adminNotificationDetail, isLoading: isFetchingDetail } = useGetAdminNotificationByIdQuery(notificationId, {
    skip: !notificationId || !isDetailModalOpen,
  });

  const [retryDelivery, { isLoading: isRetrying }] = useRetryNotificationDeliveryMutation();
  const [retrySuccess, setRetrySuccess] = useState(false);
  const [retryErrorMessage, setRetryErrorMessage] = useState<string | null>(null);

  if (!isDetailModalOpen || !selectedNotification) return null;

  const handleClose = () => {
    dismissDetailModal();
  };

  const handleRetry = async () => {
    setRetryErrorMessage(null);
    setRetrySuccess(false);
    try {
      await retryDelivery({ notificationId: selectedNotification.id }).unwrap();
      setRetrySuccess(true);
      setTimeout(() => setRetrySuccess(false), 3000);
    } catch (e: any) {
      const msg = e?.data?.message || e?.message || (isEnglish ? "No failed notification deliveries are available to retry." : "មិនមានការជូនដំណឹងដែលបានបរាជ័យសម្រាប់ផ្ញើឡើងវិញទេ។");
      setRetryErrorMessage(msg);
      setTimeout(() => setRetryErrorMessage(null), 4000);
    }
  };

  const config = CATEGORY_CONFIGS[(selectedNotification as any).category || selectedNotification.notificationType];

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "LOW":
        return dict.notifications.priorityLow;
      case "MEDIUM":
        return dict.notifications.priorityMedium;
      case "HIGH":
        return dict.notifications.priorityHigh;
      case "URGENT":
        return dict.notifications.priorityUrgent;
      default:
        return priority || dict.notifications.priorityMedium;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DAILY_EXPENSE":
      case "DAILY_REMINDER":
        return <Wallet className="text-[#FFC83D]" size={24} />;
      case "BUDGET_WARNING":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "SAVINGS_GOAL":
      case "SAVINGS_REMINDER":
        return <Target className="text-emerald-500" size={24} />;
      case "RECURRING_TX":
      case "RECURRING_REMINDER":
        return <Repeat className="text-[#003377] dark:text-blue-400" size={24} />;
      case "MONTHLY_SUMMARY":
        return <BarChart3 className="text-indigo-500" size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  const categoryName = isEnglish
    ? config?.nameEn || selectedNotification.notificationType
    : config?.nameKh || selectedNotification.notificationType;

  const displayTitle = isEnglish
    ? adminNotificationDetail?.title || selectedNotification.title || (selectedNotification as any).titleKh
    : adminNotificationDetail?.title || (selectedNotification as any).titleKh || selectedNotification.title;

  const displayMessage = isEnglish
    ? adminNotificationDetail?.message || selectedNotification.message || (selectedNotification as any).messageKh
    : adminNotificationDetail?.message || (selectedNotification as any).messageKh || selectedNotification.message;

  const createdDateFormatted = new Date(
    adminNotificationDetail?.createdAt || selectedNotification.createdAt
  ).toLocaleString(isEnglish ? "en-US" : "km-KH");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200 font-google-sans">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              {getCategoryIcon((selectedNotification as any).category || selectedNotification.notificationType)}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#003377] dark:text-[#FFC83D]">
                {categoryName}
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 font-google-sans">
                {dict.notifications.detailTitle}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={dict.common.close}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 font-google-sans">
          {isFetchingDetail ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <RefreshCw className="animate-spin text-[#FFC83D] mb-2" size={24} />
              <p className="text-xs">{dict.notifications.fetchingDetails}</p>
            </div>
          ) : (
            <>
              {/* Notification Title & Priority */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      (selectedNotification as any).priority === "HIGH" || (selectedNotification as any).priority === "URGENT"
                        ? "bg-red-500"
                        : (selectedNotification as any).priority === "MEDIUM"
                        ? "bg-[#FFC83D]"
                        : "bg-blue-500"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {dict.notifications.priorityLabel} {getPriorityLabel((selectedNotification as any).priority || "MEDIUM")}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {displayTitle}
                </h4>
              </div>

              {/* Channels Used */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">{dict.notifications.channelsLabel}</span>
                {((adminNotificationDetail?.channels?.includes("IN_APP") || (selectedNotification as any).channels?.includes("IN_APP")) ?? true) && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    <Bell size={12} /> {dict.notifications.channelInApp}
                  </span>
                )}
                {((adminNotificationDetail?.channels?.includes("EMAIL") || (selectedNotification as any).channels?.includes("EMAIL")) ?? false) && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    <Mail size={12} /> {dict.notifications.channelEmail}
                  </span>
                )}
              </div>

              {/* Message Body */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 dark:bg-slate-800/60 dark:border-slate-750 dark:text-slate-300 leading-relaxed font-google-sans">
                {displayMessage}
              </div>

              {/* Error Message Banner */}
              {retryErrorMessage && (
                <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 p-3 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/20 font-google-sans">
                  <AlertTriangle size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>{retryErrorMessage}</span>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center text-xs text-slate-400 gap-1.5">
                <Calendar size={14} />
                <span>{dict.notifications.sentDateLabel} {createdDateFormatted}</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-850">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying || retrySuccess}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300 transition disabled:opacity-50"
            title="Retry sending failed notification deliveries"
          >
            {isRetrying ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>{dict.notifications.retrying}</span>
              </>
            ) : retrySuccess ? (
              <>
                <Check size={14} className="text-green-600" />
                <span>{dict.notifications.retriedSuccess}</span>
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                <span>{dict.notifications.retryDelivery}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {dict.common.close}
          </button>

          {selectedNotification.actionUrl && (
            <a
              href={selectedNotification.actionUrl}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#003377] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] transition"
            >
              <span>{dict.notifications.viewActionUrl}</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
