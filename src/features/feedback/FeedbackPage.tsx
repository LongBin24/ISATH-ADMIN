"use client";

import { useMemo, useState } from "react";
import {
  Search,
  MessageCircle,
  CheckCircle2,
  Loader2,
  Star,
} from "lucide-react";
import FeedbackCard from "./components/FeedbackCard";
import FeedbackStatCard from "./components/FeedbackStatCard";
import FeedbackTabs from "./components/FeedbackTabs";
import { feedbackTabs } from "./data";
import { FeedbackStatus } from "./types";
import { useGetFeedbackQuery } from "./api";

export default function FeedbackPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FeedbackStatus>("all");
  const { data: feedback = [], isLoading, isError } = useGetFeedbackQuery();

  const filteredFeedback = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return feedback.filter((item) => {
      const matchesTab = activeTab === "all" || item.status === activeTab;
      const matchesSearch =
        !normalizedSearch ||
        [item.title, item.description, item.category, item.status]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, feedback, search]);

  const summary = useMemo(() => {
    const resolved = feedback.filter(
      (item) => item.status === "resolved",
    ).length;
    const inProgress = feedback.filter(
      (item) => item.status === "in-progress",
    ).length;
    const total = feedback.length;
    const ratingSum = feedback.reduce(
      (sum, item) => sum + item.rating,0,
    );

    return {
      total,
      resolved,
      inProgress,
      averageRating: total ? Number((ratingSum / total).toFixed(1)) : 0,
    };
  }, [feedback]);

  return (
    <div className="space-y-8 font-google-sans">
      <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div className="grid gap-4 sm:grid-cols-4 w-full  text-[#003377]">
            <FeedbackStatCard
              title="Total Submitted"
              value={summary.total}
              description="All feedback items"
              icon={MessageCircle}
              accent="#003377"
            />
            <FeedbackStatCard
              title="Resolved"
              value={summary.resolved}
              description="Tickets closed"
              icon={CheckCircle2}
              accent="#10B981"
            />
            <FeedbackStatCard
              title="In Progress"
              value={summary.inProgress}
              description="Pending review"
              icon={Loader2}
              accent="#F59E0B"
            />
            <FeedbackStatCard
              title="Avg Rating"
              value={`${summary.averageRating} ★`}
              description="Customer sentiment"
              icon={Star}
              accent="#FBBF24"
            />
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Search feedback..."
                className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FeedbackTabs
                tabs={feedbackTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            Loading feedback…
          </div>
        ) : isError ? (
          <div className="rounded-4xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
            Unable to load feedback from the API.
          </div>
        ) : filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))
        ) : (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No feedback matches your search.
          </div>
        )}
      </div>
    </div>
  );
}
