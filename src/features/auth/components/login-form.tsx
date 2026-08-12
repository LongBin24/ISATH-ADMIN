'use client';

import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { authClient } from "../../../lib/auth/auth-client";
import { toast } from "sonner";

export function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async () => {
  setIsLoading(true);
  try {
    const result = await authClient.signIn.social({
      provider: "keycloak",
      callbackURL: "/dashboard",
    }, {

      onSuccess: () => {
 
      },
      onError: (ctx) => {
        console.error("Login Error:", ctx.error);
        toast.error(ctx.error.message || "មានបញ្ហាក្នុងការតភ្ជាប់");
        setIsLoading(false); 
      }
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    setIsLoading(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Admin Identity Badge */}
      <div className="rounded-2xl border border-[#FFC83D]/20 bg-[#FFC83D]/[0.08] p-4 dark:border-[#FFC83D]/10 dark:bg-[#FFC83D]/[0.05]">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#003377] text-[#FFC83D] shadow-lg">
            <Lock className="size-6" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#003377] dark:text-white">Admin Control Center</p>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              តំបន់គ្រប់គ្រងសម្រាប់អ្នករដ្ឋបាល។ សូមចូលគណនីតាមរយៈប្រព័ន្ធ SSO រួម។
            </p>
          </div>
        </div>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400 dark:bg-[#0e1a2c]">Secure Authentication</span>
        </div>
      </div>

      {/* Main Login Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={handleAdminLogin}
        className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#003377] px-5 text-base font-bold text-white shadow-[0_10px_25px_-10px_rgba(0,51,119,0.5)] transition-all hover:-translate-y-1 hover:bg-[#002255] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed dark:bg-[#FFC83D] dark:text-[#003377] dark:shadow-[0_10px_25px_-10px_rgba(255,200,61,0.3)] dark:hover:bg-[#f5b91f]"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-[#003377]"></div>
            កំពុងតភ្ជាប់...
          </span>
        ) : (
          <>
            <ShieldCheck className="size-5" />
            ចូលគណនី Admin តាម Keycloak
            <ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
          </>
        )}
      </button>

      {/* Footer Info */}
      <div className="space-y-4 pt-2">
        <p className="text-center text-[11px] leading-5 text-slate-400 dark:text-slate-500 italic">
            * ប្រព័ន្ធនឹងឆែករក Role "ADMIN" ដោយស្វ័យប្រវត្តិ។ ប្រសិនបើលោកអ្នកមិនមានសិទ្ធិទេ នោះការចូលនឹងត្រូវបដិសេធ។
        </p>
        
        <div className="flex items-center justify-center border-t border-slate-100 pt-4 dark:border-slate-800">
           <p className="text-xs text-slate-500">បញ្ហាការចូលប្រើ? <span className="font-bold text-[#003377] dark:text-[#FFC83D] cursor-pointer hover:underline">ទាក់ទង IT Support</span></p>
        </div>
      </div>
    </div>
  );
}