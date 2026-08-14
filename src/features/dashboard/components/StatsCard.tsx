"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  onClick,
}: StatsCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[108px] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm flex items-center justify-between text-left border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all font-google-sans ${
        onClick ? "cursor-pointer active:scale-[0.99]" : ""
      }`}
    >
      <div className="space-y-1.5 flex-1 min-w-0 pr-3">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-snug truncate">
          {title}
        </p>
        <h3 className="text-3xl font-bold tracking-tight" style={{ color: color }}>
          {value.toLocaleString()}
        </h3>
      </div>
      <div
        className="p-4 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={28} style={{ color: color }} />
      </div>
    </button>
  );
}