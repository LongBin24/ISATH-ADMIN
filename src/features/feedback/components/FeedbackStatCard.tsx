import { LucideIcon } from "lucide-react";

interface FeedbackStatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export default function FeedbackStatCard({
  title,
  value,
  description,
  icon: Icon,
  accent,
}: FeedbackStatCardProps) {
  return (

    <div className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl sm:p-5">

      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 sm:text-xs sm:tracking-[0.16em]">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#003377] dark:text-white sm:mt-3 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            {description}
          </p>
        </div>
        <div
          className="shrink-0 rounded-xl p-2 sm:rounded-2xl sm:p-3"
          style={{ backgroundColor: `${accent}20` }}
        >
          <Icon className="size-4 sm:size-6" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}
