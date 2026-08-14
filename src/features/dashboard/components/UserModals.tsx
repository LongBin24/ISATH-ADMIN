"use client";

import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

export function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { dict } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[440px] text-center p-10 rounded-3xl border-none shadow-2xl font-google-sans">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={40} strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white font-google-sans">
              {dict.dashboard.userCreatedModalTitle}
            </DialogTitle>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {dict.dashboard.userCreatedModalDesc}
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#FFC83D] hover:bg-[#eab308] text-[#003377] font-bold rounded-2xl transition-all shadow-md"
          >
            {dict.common.close}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}