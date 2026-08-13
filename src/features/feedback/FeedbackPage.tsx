"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Search, Star } from "lucide-react";
import { useGetFeedbackQuery } from "./api";
import FeedbackCard from "./components/FeedbackCard";
import FeedbackStatCard from "./components/FeedbackStatCard";
import FeedbackTabs from "./components/FeedbackTabs";
import ReviewDetailModal from "./components/ReviewDetailModal";
import { feedbackTabs } from "./data";
import type { FeedbackStatus } from "./types";

export default function FeedbackPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FeedbackStatus>("ALL");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const { data: feedback = [], isLoading, isError } = useGetFeedbackQuery();

  const filteredFeedback = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return feedback.filter((item) => {
      const matchesTab = activeTab === "ALL" || item.reviewStatus === activeTab;
      const matchesSearch =
        !normalizedSearch ||
        [item.title, item.description, item.reviewType, item.reviewStatus, item.userId]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, feedback, search]);

  const summary = useMemo(() => {
    const resolved = feedback.filter(
      (item) => item.reviewStatus === "RESOLVED" || item.reviewStatus === "CLOSED",
    ).length;
    const inProgress = feedback.filter((item) => item.reviewStatus === "IN_REVIEW").length;
    const ratedReviews = feedback.filter((item) => item.overallRating !== null);
    const ratingSum = ratedReviews.reduce((sum, item) => sum + (item.overallRating ?? 0), 0);

    return {
      total: feedback.length,
      resolved,
      inProgress,
      averageRating: ratedReviews.length
        ? Number((ratingSum / ratedReviews.length).toFixed(1))
        : 0,
    };
  }, [feedback]);

  return (
    <div className="min-w-0 space-y-4 font-google-sans sm:space-y-6 xl:space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:rounded-4xl sm:p-5 lg:p-6">
        <div className="mb-5 sm:mb-8">
          <div className="grid w-full grid-cols-2 gap-2 text-[#003377] sm:gap-4 xl:grid-cols-4">
            <FeedbackStatCard title="បានដាក់ស្នើសរុប" value={summary.total} description="មតិកែលម្អទាំងអស់" icon={MessageCircle} accent="#003377" />
            <FeedbackStatCard title="បានដោះស្រាយ" value={summary.resolved} description="បានដោះស្រាយ ឬបានបិទ" icon={CheckCircle2} accent="#10B981" />
            <FeedbackStatCard title="កំពុងពិនិត្យ" value={summary.inProgress} description="កំពុងត្រូវបានពិនិត្យ" icon={Loader2} accent="#F59E0B" />
            <FeedbackStatCard title="ពិន្ទុមធ្យម" value={`${summary.averageRating} ★`} description="មតិដែលបានវាយតម្លៃ" icon={Star} accent="#FBBF24" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:rounded-4xl sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="ស្វែងរកមតិកែលម្អ…" className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
            </div>
            <div className="min-w-0">
              <FeedbackTabs tabs={feedbackTabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">កំពុងផ្ទុកមតិកែលម្អ…</div>
        ) : isError ? (
          <div className="rounded-4xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">មិនអាចផ្ទុកមតិកែលម្អបានទេ។</div>
        ) : filteredFeedback.length > 0 ? (
          filteredFeedback.map((item) => <FeedbackCard key={item.id} feedback={item} onView={setSelectedReviewId} />)
        ) : (
          <div className="rounded-4xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">រកមិនឃើញមតិកែលម្អដែលត្រូវនឹងការស្វែងរកទេ។</div>
        )}
      </div>

      <ReviewDetailModal reviewId={selectedReviewId} onClose={() => setSelectedReviewId(null)} />
    </div>
  );
}
