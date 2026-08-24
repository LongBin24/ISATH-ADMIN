"use client";

import { UserSummary } from "../type";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";

export default function UserStatsModal({ 
  open, 
  onOpenChange, 
  data, 
  isLoading 
}: { 
  open: boolean; 
  onOpenChange: (v: boolean) => void; 
  data?: UserSummary; 
  isLoading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-8 rounded-[28px]">
        <div className="flex items-center justify-between mb-6">
        <DialogTitle className="text-xl font-bold text-[#003377] mb-8 font-google-sans">
          អ្នកប្រើប្រាស់សរុប
        </DialogTitle>
        <button onClick={() => onOpenChange(false)} aria-label="close" className="mb-8 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X />
            </button>
        </div>

        <div className="space-y-4 mb-10">
          {isLoading ? (
            [1, 2, 3, 4].map((i) => <div key={i} className="h-14 w-full bg-slate-100 animate-pulse rounded-2xl" />)
          ) : (
            <>
              <StatRow label="សរុប" value={data?.totalUsers ?? 2} />
              <StatRow label="សកម្ម" value={data?.totalActiveUsers ?? 2} />
              <StatRow label="Admin" value={data?.totalAdmins ?? 1} />
              <StatRow label="ថ្មីខែនេះ" value={data?.newUsersToday ?? 0} />
            </>
          )}
        </div>

        <button onClick={() => onOpenChange(false)} className="w-full py-4 bg-[#FFC83D] text-[#003377] font-bold rounded-2xl font-hanuman">
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
      <span className="text-[#003377] font-bold font-google-sans text-lg">{value.toLocaleString()}</span>
    </div>
  );
}