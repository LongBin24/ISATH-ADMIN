"use client";

import React, { useMemo } from "react";
import {
  Search,
  Filter,
  Check,
  Trash2,
  Bell,
  Wallet,
  AlertTriangle,
  Target,
  Repeat,
  BarChart3,
} from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
} from "../api";
import { useNotificationUI } from "../hook";
import { CATEGORY_CONFIGS } from "../constants";
import { NotificationCategory } from "../types";

export default function InAppNotificationFeed() {
  const {
    selectedCategoryFilter,
    searchQuery,
    changeCategoryFilter,
    changeSearchQuery,
    selectNotification,
  } = useNotificationUI();

  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  // Filtered Notifications based on selected tab and search term
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesCategory =
        selectedCategoryFilter === "ALL" || item.category === selectedCategoryFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.titleKh.toLowerCase().includes(query) ||
        item.messageKh.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [notifications, selectedCategoryFilter, searchQuery]);

  // Icon mapping
  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case "DAILY_EXPENSE":
        return <Wallet className="text-[#FFC83D]" size={20} />;
      case "BUDGET_WARNING":
        return <AlertTriangle className="text-red-500" size={20} />;
      case "SAVINGS_GOAL":
        return <Target className="text-emerald-500" size={20} />;
      case "RECURRING_TX":
        return <Repeat className="text-[#003377] dark:text-sky-400" size={20} />;
      case "MONTHLY_SUMMARY":
        return <BarChart3 className="text-indigo-500" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  // Human friendly time diff in Khmer
  const formatKhmerTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return "ទើបតែឥឡូវនេះ";
    if (mins < 60) return `${mins} នាទីមុន`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ម៉ោងមុន`;
    const days = Math.floor(hours / 24);
    return `${days} ថ្ងៃមុន`;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar & Category Filter Pills */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => changeSearchQuery(e.target.value)}
              placeholder="ស្វែងរកការជូនដំណឹង..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#FFC83D] focus:ring-2 focus:ring-[#FFC83D]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Filter size={16} />
            <span>បង្ហាញ {filteredNotifications.length} នៃ {notifications.length} ការជូនដំណឹង</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => changeCategoryFilter("ALL")}
            className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold transition ${
              selectedCategoryFilter === "ALL"
                ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            ទាំងអស់
          </button>

          {Object.values(CATEGORY_CONFIGS).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => changeCategoryFilter(cat.id)}
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedCategoryFilter === cat.id
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              <span>{cat.nameKh}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFC83D] border-t-transparent" />
          <p className="text-sm font-semibold text-slate-500">កំពុងទាញយកទិន្នន័យ...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-[#FFC83D] dark:bg-slate-800">
            <Bell size={32} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">
            មិនមានការជូនដំណឹងទេ
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            គ្មានការជូនដំណឹងដែលត្រូវគ្នានឹងការស្វែងរករបស់អ្នកឡើយ។ អ្នកអាចបង្កើតការជូនដំណឹងសាកល្បងដោយចុចប៊ូតុងខាងលើ។
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredNotifications.map((item) => {
            const config = CATEGORY_CONFIGS[item.category];

            return (
              <div
                key={item.id}
                onClick={() => selectNotification(item)}
                className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl p-5 transition cursor-pointer border ${
                  !item.isRead
                    ? "bg-amber-500/5 border-[#FFC83D]/40 shadow-sm dark:bg-slate-850 dark:border-[#FFC83D]/30"
                    : "bg-white border-slate-200/80 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
                }`}
              >
                {/* Left Section: Icon & Title/Message */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Category Icon with unread dot */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 transition group-hover:scale-105">
                    {getCategoryIcon(item.category)}
                    {!item.isRead && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#FFC83D] ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#003377] dark:text-[#FFC83D]">
                        {config?.nameKh || item.category}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {formatKhmerTimeAgo(item.createdAt)}
                      </span>

                      {/* Priority Tag in Khmer */}
                      {item.priority === "HIGH" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-300">
                          សំខាន់
                        </span>
                      )}
                      {item.priority === "URGENT" && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          បន្ទាន់
                        </span>
                      )}
                    </div>

                    <h4 className={`text-base font-bold leading-snug ${!item.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {item.titleKh}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-google-sans">
                      {item.messageKh}
                    </p>

                    {/* Metadata pill snippet */}
                    {item.metadata?.amount && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          ទឹកប្រាក់៖ ${item.metadata.amount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div
                  className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item.id)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:border-[#FFC83D] hover:bg-amber-50 hover:text-[#003377] dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      title="សញ្ញាថាបានអានហើយ"
                    >
                      <Check size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="rounded-xl border border-slate-200 p-2 text-slate-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:bg-slate-800"
                    title="លុបចោល"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
