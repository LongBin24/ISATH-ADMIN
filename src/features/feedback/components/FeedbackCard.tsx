import { ChevronRight, Star } from "lucide-react";
import type { Review, ReviewStatus } from "../types";

interface FeedbackCardProps {
  feedback: Review;
  onView: (id: string) => void;
}

const statusStyles: Record<ReviewStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  IN_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  RESOLVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  CLOSED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
};

const statusLabels: Record<ReviewStatus, string> = {
  PENDING: "កំពុងរង់ចាំ",
  IN_REVIEW: "កំពុងពិនិត្យ",
  RESOLVED: "បានដោះស្រាយ",
  CLOSED: "បានបិទ",
};

export default function FeedbackCard({ feedback, onView }: FeedbackCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 font-google-sans shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950 sm:rounded-4xl sm:p-6">
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
              {feedback.reviewType}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[feedback.reviewStatus]}`}>
              {statusLabels[feedback.reviewStatus]}
            </span>
          </div>
          <div>
            <h2 className="break-words text-lg font-semibold text-[#003377] dark:text-white sm:text-xl">{feedback.title}</h2>
            <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400 sm:mt-3 sm:line-clamp-2">
              {feedback.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400" /> {feedback.overallRating ?? "—"}
            </div>
            <div>{new Intl.DateTimeFormat("km-KH").format(new Date(feedback.createdAt))}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onView(feedback.id)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-[#003377] transition hover:bg-[#FFC83D] hover:text-[#003377] hover:border-[#FFC83D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:hover:border-slate-500 sm:w-auto sm:self-start sm:rounded-full"
        >
          មើលព័ត៌មានលម្អិត <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
