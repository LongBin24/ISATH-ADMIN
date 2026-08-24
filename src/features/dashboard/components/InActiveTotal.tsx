"use client";

import { InActiveSummary } from "../type";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

export default function InActiveStatsModal({
  open,
  onOpenChange,
  data,
  isLoading,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: InActiveSummary;
  isLoading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-8 rounded-[28px]">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl font-bold text-[#003377] mb-8 font-google-sans">
            អ្នកប្រើមិនសកម្ម
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            aria-label="close"
            className="mb-8 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X />
          </button>
        </div>

        <div className="space-y-4 mb-10">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 w-full bg-slate-100 animate-pulse rounded-2xl"
              />
            ))
          ) : (
            <>
              <StatRow label="សរុប" value={data?.totalInActive ?? 2} />
              <StatRow label="> 30 ថ្ងៃ" value={data?.moreThan30Days ?? 2} />
              <StatRow label="> 90 ថ្ងៃ" value={data?.moreThan90Days ?? 1} />
              <StatRow label="ត្រូវបិទ" value={data?.pendingClose ?? 0} />
            </>
          )}
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="w-full py-4 bg-[#FFC83D] text-[#003377] font-bold rounded-2xl font-hanuman"
        >
          បិទ
        </button>
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
      <span className="text-slate-500 font-hanuman text-sm">{label}</span>
      <span className="text-[#003377] font-bold font-google-sans text-lg">
        {value.toLocaleString()}
      </span>
    </div>
  );
}
