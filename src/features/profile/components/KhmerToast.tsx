"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface KhmerToastProps {
  type: "success" | "error" | null;
  message: string | null;
  onClose: () => void;
}

export default function KhmerToast({ type, message, onClose }: KhmerToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !type) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {type === "success" ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]">
          <CheckCircle2 className="h-6 w-6 stroke-[2.5]" />
        </div>
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-6 w-6 stroke-[2.5]" />
        </div>
      )}

      <div className="pr-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white font-google-sans">
          {type === "success" ? "ជោគជ័យ!" : "មានបញ្ហា!"}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-google-sans">
          {message}
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
