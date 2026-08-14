"use client";

import { ProcessSummary } from "../type";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

export default function ProcessStatsModal({
  open,
  onOpenChange,
  data,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: ProcessSummary;
  isLoading: boolean;
}) {
  const { dict } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-8 rounded-[28px] font-google-sans">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-bold text-[#003377] dark:text-white font-google-sans">
            {dict.dashboard.processModalTitle}
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={dict.common.close}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl"
              />
            ))
          ) : (
            <>
              <StatRow label={dict.dashboard.totalLabel} value={data?.totalProcesses ?? 48291} />
              <StatRow label={dict.dashboard.todayLabel} value={data?.totalCompleted ?? 234} />
              <StatRow label={dict.dashboard.incomeLabel} value={data?.totalIncome ?? 28540} />
              <StatRow label={dict.dashboard.expenseLabel} value={data?.totalExpenses ?? 19751} />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="w-full py-3.5 bg-[#FFC83D] text-[#003377] font-bold rounded-2xl transition hover:bg-[#f7c948]"
        >
          {dict.common.close}
        </button>
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
      <span className="text-slate-500 dark:text-slate-400 font-semibold text-sm">{label}</span>
      <span className="text-[#003377] dark:text-[#FFC83D] font-bold text-lg">{value.toLocaleString()}</span>
    </div>
  );
}
