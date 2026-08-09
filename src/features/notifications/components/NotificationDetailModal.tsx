"use client";

import React from "react";
import { X, Calendar, ExternalLink, Wallet, AlertTriangle, Target, Repeat, BarChart3, Mail, Bell } from "lucide-react";
import { useNotificationUI } from "../hook";
import { useMarkAsReadMutation } from "../api";
import { CATEGORY_CONFIGS } from "../constants";

export default function NotificationDetailModal() {
  const { selectedNotification, isDetailModalOpen, dismissDetailModal } = useNotificationUI();
  const [markAsRead] = useMarkAsReadMutation();

  if (!isDetailModalOpen || !selectedNotification) return null;

  const config = CATEGORY_CONFIGS[selectedNotification.category];

  const handleClose = () => {
    if (!selectedNotification.isRead) {
      markAsRead(selectedNotification.id);
    }
    dismissDetailModal();
  };

  const getPriorityKh = (priority: string) => {
    switch (priority) {
      case "LOW":
        return "ទាប";
      case "MEDIUM":
        return "មធ្យម";
      case "HIGH":
        return "ខ្ពស់";
      case "URGENT":
        return "បន្ទាន់";
      default:
        return priority;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DAILY_EXPENSE":
        return <Wallet className="text-[#FFC83D]" size={24} />;
      case "BUDGET_WARNING":
        return <AlertTriangle className="text-red-500" size={24} />;
      case "SAVINGS_GOAL":
        return <Target className="text-emerald-500" size={24} />;
      case "RECURRING_TX":
        return <Repeat className="text-[#003377] dark:text-blue-400" size={24} />;
      case "MONTHLY_SUMMARY":
        return <BarChart3 className="text-indigo-500" size={24} />;
      default:
        return <Bell size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              {getCategoryIcon(selectedNotification.category)}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#003377] dark:text-[#FFC83D]">
                {config?.nameKh || selectedNotification.category}
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
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
          {/* Notification Title & Priority */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  selectedNotification.priority === "HIGH" || selectedNotification.priority === "URGENT"
                    ? "bg-red-500"
                    : selectedNotification.priority === "MEDIUM"
                    ? "bg-[#FFC83D]"
                    : "bg-blue-500"
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                កម្រិតអាទិភាព៖ {getPriorityKh(selectedNotification.priority)}
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {selectedNotification.titleKh}
            </h4>
          </div>

          {/* Channels Used */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">ប៉ុស្តិ៍ជូនដំណឹង៖</span>
            {selectedNotification.channels.includes("IN_APP") && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                <Bell size={12} /> ក្នុងកម្មវិធី
              </span>
            )}
            {selectedNotification.channels.includes("EMAIL") && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Mail size={12} /> អ៊ីមែល
              </span>
            )}
          </div>

          {/* Message Body */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-sm text-slate-700 dark:bg-slate-800/60 dark:border-slate-750 dark:text-slate-300 leading-relaxed font-google-sans">
            {selectedNotification.messageKh}
          </div>

          {/* Metadata Display (if present) */}
          {selectedNotification.metadata && (
            <div className="rounded-2xl bg-amber-500/5 p-4 border border-[#FFC83D]/20 space-y-3">
              <h5 className="text-xs font-bold text-[#003377] dark:text-[#FFC83D] uppercase tracking-wider">
                ទិន្នន័យបន្ថែម
              </h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {selectedNotification.metadata.amount !== undefined && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">ចំនួនទឹកប្រាក់៖</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      ${selectedNotification.metadata.amount.toFixed(2)}
                    </p>
                  </div>
                )}
                {selectedNotification.metadata.budgetLimit !== undefined && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">ដែនកំណត់ថវិកា៖</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      ${selectedNotification.metadata.budgetLimit.toFixed(2)}
                    </p>
                  </div>
                )}
                {selectedNotification.metadata.budgetCategory && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">ប្រភេទចំណាយ៖</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedNotification.metadata.budgetCategory}
                    </p>
                  </div>
                )}
                {selectedNotification.metadata.savingsGoalName && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">ឈ្មោះគោលដៅ៖</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedNotification.metadata.savingsGoalName}
                    </p>
                  </div>
                )}
                {selectedNotification.metadata.dueDate && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">កាលបរិច្ឆេទត្រូវបង់៖</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedNotification.metadata.dueDate}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar if budget or savings goal */}
              {selectedNotification.metadata.budgetUsedPercent !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>ការប្រើប្រាស់ថវិកា</span>
                    <span className="text-red-500">{selectedNotification.metadata.budgetUsedPercent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${selectedNotification.metadata.budgetUsedPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center text-xs text-slate-400 gap-1.5">
            <Calendar size={14} />
            <span>កាលបរិច្ឆេទផ្ញើ៖ {new Date(selectedNotification.createdAt).toLocaleString("km-KH")}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-850">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            បិទ
          </button>

          {selectedNotification.actionUrl && (
            <a
              href={selectedNotification.actionUrl}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#003377] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] transition"
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
