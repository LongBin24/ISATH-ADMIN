import { ReactNode } from 'react';

export function AuthCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="relative mx-auto max-h-[calc(100dvh-2rem)] w-full max-w-[27rem] overflow-y-auto overflow-x-hidden rounded-[1.5rem] border border-[#003377]/10 bg-white/[0.88] p-4 shadow-[0_24px_64px_-32px_rgba(0,51,119,0.42)] ring-1 ring-white/70 backdrop-blur-xl sm:max-h-[calc(100dvh-2.5rem)] sm:p-5 lg:max-h-[calc(100dvh-1.5rem)] dark:border-[#29415d]/65 dark:bg-[#0e1a2c]/90 dark:ring-white/[0.035] dark:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.9)]">
      <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#FFC83D] to-transparent" />
      <div className="relative z-10 mb-4">
        <div className="mb-4 flex items-center gap-3 lg:hidden"><div className="grid size-10 place-items-center rounded-2xl bg-[#FFC83D] text-base font-black text-[#003377] shadow-[0_8px_22px_-10px_rgba(255,200,61,0.8)]">iS</div><span className="text-lg font-bold text-[#003377] dark:text-[#FFC83D]">iStash</span></div>
        <h1 className="text-[1.55rem] font-bold leading-tight tracking-[-0.025em] text-[#003377] sm:text-[1.8rem] dark:text-white">{title}</h1>
        <p className="mt-1.5 max-w-sm text-sm leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
