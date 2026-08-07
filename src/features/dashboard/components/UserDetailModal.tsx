"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { User, Mail, Tag, Calendar, DollarSign, Repeat, X } from "lucide-react";

export default function UserDetailModal({ open, onOpenChange, user }: { open: boolean; onOpenChange: (v: boolean) => void; user: any | null; }) {
  const joined = user?.joinedAt ?? user?.createdAt ?? "2026-07-14";
  const balance = user?.balance ?? user?.wallet ?? 1250;
  const transactions = user?.transactionsCount ?? 42;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full rounded-2xl p-0 overflow-hidden">
        <div className="relative bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between p-6">
            <DialogTitle className="text-lg font-bold text-[#003377] dark:text-white">ព័ត៌មានអ្នកប្រើប្រាស់</DialogTitle>
            <button onClick={() => onOpenChange(false)} aria-label="close" className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#003377] text-white text-lg font-bold">
                {user?.name?.[0] ?? "U"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name ?? "ឈ្មោះ"}</h3>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800">{user?.role ?? "user"}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{user?.email ?? "email@example.com"}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="text-sm text-slate-500 flex items-center gap-2"><Calendar size={14} /> ថ្ងៃចូលប្រើ</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{joined}</div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="text-sm text-slate-500 flex items-center gap-2"><DollarSign size={14} /> គណនី</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">${balance.toLocaleString()}</div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="text-sm text-slate-500 flex items-center gap-2"><Repeat size={14} /> ប្រតិបត្តិការ</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white">{transactions} ដង</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button onClick={() => onOpenChange(false)} className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">បិទ</button>
              <button onClick={() => console.log('edit', user)} className="flex-1 rounded-full bg-[#FFC83D] py-3 text-sm font-semibold text-[#003377] shadow-sm">​បិទគណនី</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
