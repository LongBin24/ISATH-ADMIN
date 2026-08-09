import { Star, ChevronRight } from "lucide-react";
import { FeedbackItem } from "../types";

interface FeedbackCardProps {
  feedback: FeedbackItem;
}

const statusStyles: Record<FeedbackItem["status"], string> = {
  resolved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
  "in-progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  new: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
};

export default function FeedbackCard({ feedback }: FeedbackCardProps) {
  return (
    <article className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 dark:border-slate-800 dark:bg-slate-900">
              {feedback.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[feedback.status]}`}
            >
              {feedback.status === "in-progress"
                ? "In Progress"
                : feedback.status}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#003377] dark:text-white">
              {feedback.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {feedback.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-400" /> {feedback.rating}.0
            </div>
            <div>{feedback.votes} votes</div>
            <div>{feedback.date}</div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-[#003377] transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 shrink-0 whitespace-nowrap"
        >
          View details <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
