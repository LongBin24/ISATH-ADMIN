"use client";

import React, { useState } from "react";
import { X, Calendar, ExternalLink, Wallet, AlertTriangle, Target, Repeat, BarChart3, Mail, Bell, RotateCcw, Check, RefreshCw } from "lucide-react";
import { useNotificationUI } from "../hook";
import { CATEGORY_CONFIGS } from "../constants";
import { useRetryNotificationDeliveryMutation, useGetAdminNotificationByIdQuery } from "../api";

export default function NotificationDetailModal() {
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
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || err?.message || "No failed notification deliveries are available to retry.";
      setRetryErrorMessage(msg);
      setTimeout(() => setRetryErrorMessage(null), 4000);
    }
  };

  const category = selectedNotification.category || selectedNotification.notificationType;
  const config = category ? CATEGORY_CONFIGS[category] : undefined;
  const priority = selectedNotification.priority || "MEDIUM";

  const getPriorityKh = (p: string) => {
    switch (p) {
      case "LOW":
        return "ទាប";
      case "MEDIUM":
        return "មធ្យម";
      case "HIGH":
        return "ខ្ពស់";
      case "URGENT":
        return "បន្ទាន់";
      default:
        return p || "មធ្យម";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
              {getCategoryIcon(category || "")}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
                {config?.nameKh || selectedNotification.notificationType}
              </span>
              <h3 className="text-base font-bold text-[#003377] dark:text-[#FFC83D] font-google-sans">
                ព័ត៌មានលម្អិតនៃការជូនដំណឹង
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
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
              <p className="text-xs">កំពុងទាញយកព័ត៌មានលម្អិត... (Fetching details by ID)</p>
            </div>
          ) : (
            <>
              {/* Notification Title & Priority */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      priority === "HIGH" || priority === "URGENT"
                        ? "bg-red-500"
                        : priority === "MEDIUM"
                        ? "bg-[#FFC83D]"
                        : "bg-blue-500"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    កម្រិតអាទិភាព៖ {getPriorityKh(priority)}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {adminNotificationDetail?.title || selectedNotification.titleKh || selectedNotification.title}
                </h4>
              </div>


              {/* Channels Used */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">ប៉ុស្តិ៍ជូនដំណឹង៖</span>
                {((adminNotificationDetail?.channels?.includes("IN_APP") || selectedNotification.channels?.includes("IN_APP")) ?? true) && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    <Bell size={12} /> ក្នុងកម្មវិធី
                  </span>
                )}
                {((adminNotificationDetail?.channels?.includes("EMAIL") || selectedNotification.channels?.includes("EMAIL")) ?? false) && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    <Mail size={12} /> អ៊ីមែល
                  </span>
                )}
              </div>

              {/* Message Body */}
              <div className="rounded-2xl border border-slate-200/80 border-l-4 border-l-[#003377] bg-slate-50/70 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-800 dark:border-l-[#FFC83D] dark:bg-slate-900/50 dark:text-slate-200 font-google-sans">
                {adminNotificationDetail?.message || selectedNotification.messageKh || selectedNotification.message}
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
                <span>កាលបរិច្ឆេទផ្ញើ៖ {new Date(adminNotificationDetail?.createdAt || selectedNotification.createdAt).toLocaleString("km-KH")}</span>
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
                <span>កំពុងផ្ញើឡើងវិញ...</span>
              </>
            ) : retrySuccess ? (
              <>
                <Check size={14} className="text-green-600" />
                <span>បានផ្ញើឡើងវិញរួចរាល់!</span>
              </>
            ) : (
              <>
                <RotateCcw size={14} />
                <span>ព្យាយាមផ្ញើឡើងវិញ</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:border-[#003377] hover:text-[#003377] dark:border-slate-700 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] transition"
          >
            បិទ
          </button>

          {selectedNotification.actionUrl && (
            <a
              href={selectedNotification.actionUrl}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FFC83D] px-4 py-2.5 text-xs font-bold text-[#003377] shadow-md hover:bg-[#f0ba33] transition"
            >
              <span>ទៅកាន់ទំព័រពាក់ព័ន្ធ</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
