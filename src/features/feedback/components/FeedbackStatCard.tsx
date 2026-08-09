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
    <div className=" w-auto rounded-4xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-4 ">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-3xl font-bold text-[#003377] dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
        <div
          className="rounded-3xl p-3"
          style={{ backgroundColor: `${accent}20` }}
        >
          <Icon size={24} style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}
