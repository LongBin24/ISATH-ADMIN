'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { ReactNode } from 'react';

const highlights = [
  { icon: ShieldCheck, label: 'សុវត្ថិភាពខ្ពស់' },
  { icon: TrendingUp, label: 'តាមដានឆ្លាតវៃ' },
  { icon: Wallet, label: 'គ្រប់គ្រងងាយស្រួល' },
];

export function AuthShell({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#f2f6fb_48%,#f8fafc_100%)] font-['Google_Sans',ui-sans-serif,system-ui] text-slate-900 transition-colors duration-500 dark:bg-[linear-gradient(135deg,#07101d_0%,#091525_48%,#07101d_100%)] dark:text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 opacity-70 bg-[linear-gradient(to_right,#00337707_1px,transparent_1px),linear-gradient(to_bottom,#00337707_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)] dark:bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)]" />
      <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, 45, 0], y: [0, -25, 0], scale: [1, 1.1, 1] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -left-52 -top-48 -z-10 size-[42rem] rounded-full bg-[#FFC83D]/18 blur-[120px] dark:bg-[#FFC83D]/9" />
      <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, -35, 0], y: [0, 32, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="pointer-events-none absolute -bottom-64 right-[18%] -z-10 size-[46rem] rounded-full bg-[#2769ad]/12 blur-[140px] dark:bg-[#1d5c9e]/14" />
      
      <ThemeToggle
        variant="outline"
        size="md"
        className="absolute right-4 top-4 z-30 !size-11 !rounded-2xl shadow-sm backdrop-blur sm:right-7 sm:top-7"
      />

      <div className="relative mx-auto grid min-h-[100dvh] max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="relative hidden overflow-hidden border-r border-[#9eb7d0] bg-[linear-gradient(145deg,#cbdced_0%,#d9e6f3_52%,#c7daec_100%)] px-10 py-6 text-[#003377] shadow-[22px_0_60px_-42px_rgba(0,51,119,0.5)] lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:flex-col xl:px-14 dark:border-[#173b61] dark:bg-[linear-gradient(145deg,#010711_0%,#031426_52%,#042342_100%)] dark:text-white dark:shadow-[24px_0_65px_-40px_rgba(0,0,0,0.98)]">
          <div aria-hidden="true" className="absolute inset-0 opacity-35 bg-[radial-gradient(circle,#003377_0.8px,transparent_0.9px)] bg-[size:24px_24px] [mask-image:radial-gradient(circle_at_50%_37%,black,transparent_72%)] dark:opacity-45 dark:bg-[radial-gradient(circle,#ffffff_0.7px,transparent_0.8px)]" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgba(0,51,119,0.07),transparent_44%)] dark:bg-[radial-gradient(circle_at_48%_38%,rgba(0,51,119,0.18),transparent_46%)]" />
          <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, 35, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }} transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-[#FFC83D]/22 blur-[110px] dark:bg-[#FFC83D]/10" />
          <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, 30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-52 -right-36 size-[38rem] rounded-full bg-[#2b72bb]/12 blur-[120px] dark:bg-sky-400/8" />

          <div className="relative z-10 my-auto flex min-h-0 flex-col items-center py-[clamp(0.75rem,2dvh,1.5rem)] text-center">
            <div className="relative grid size-[clamp(250px,38dvh,340px)] shrink-0 place-items-center">
              <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-[#003377]/20 shadow-[inset_0_0_30px_rgba(0,51,119,0.03)] dark:border-white/15">
                <span className="absolute left-1/2 top-0 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#003377] text-[#FFC83D] shadow-[0_0_22px_rgba(0,51,119,0.28)] dark:border-white/15 dark:bg-[#10243e]"><ShieldCheck className="size-4" /></span>
                <span className="absolute bottom-[12%] right-[4%] size-2 rounded-full bg-[#FFC83D] shadow-[0_0_12px_3px_rgba(255,200,61,0.55)]" />
              </motion.div>

              <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: -360 }} transition={{ duration: 17, repeat: Infinity, ease: 'linear' }} className="absolute inset-8 rounded-full border border-[#FFC83D]/45 dark:border-[#FFC83D]/25">
                <span className="absolute right-0 top-1/2 grid size-11 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-[#FFC83D] text-[#003377] shadow-[0_0_24px_rgba(255,200,61,0.35)] dark:border-white/10"><TrendingUp className="size-4" /></span>
                <span className="absolute left-[14%] top-[9%] size-1.5 rounded-full bg-[#003377] shadow-[0_0_8px_2px_rgba(0,51,119,0.4)] dark:bg-white" />
              </motion.div>

              <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute inset-16 rounded-full border border-[#003377]/15 dark:border-white/10">
                <span className="absolute bottom-[8%] left-[8%] grid size-9 place-items-center rounded-full border border-white/70 bg-white text-[#003377] shadow-[0_8px_20px_rgba(0,51,119,0.18)] dark:border-white/10 dark:bg-[#142238] dark:text-[#FFC83D]"><Wallet className="size-4" /></span>
                <span className="absolute right-[10%] top-[8%] size-1.5 rounded-full bg-[#FFC83D] shadow-[0_0_9px_2px_rgba(255,200,61,0.5)]" />
              </motion.div>

              <motion.div aria-hidden="true" animate={reduceMotion ? undefined : { scale: [1, 1.18, 1], opacity: [0.3, 0.08, 0.3] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC83D] blur-2xl" />
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.72, rotate: -8, y: 26 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0, y: [0, -7, 0] }}
                transition={{ opacity: { duration: 0.65 }, scale: { type: 'spring', stiffness: 120, damping: 15 }, rotate: { duration: 0.7 }, y: { duration: 5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' } }}
                whileHover={reduceMotion ? undefined : { scale: 1.04, rotate: 2 }}
                className="relative z-10 grid size-[clamp(7rem,17dvh,10rem)] place-items-center rounded-[2.25rem] border border-white/80 bg-white/90 p-[clamp(1rem,2.2dvh,1.25rem)] shadow-[0_28px_70px_-20px_rgba(0,51,119,0.35)] backdrop-blur-xl dark:border-white/15 dark:bg-white/95"
              >
                <Image src="/logo.png" alt="iStash" width={112} height={112} priority className="size-full object-contain" />
                <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-full bg-[#FFC83D] text-[#003377] shadow-lg"><Sparkles className="size-4" /></motion.span>
              </motion.div>
            </div>

            <motion.div initial={reduceMotion ? false : 'hidden'} animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: 0.22 } } }} className="mt-[clamp(0.75rem,2.4dvh,2rem)] max-w-xl">
              <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="text-sm font-bold tracking-normal text-[#b57900] dark:text-[#FFC83D]">ជំហានថ្មីនៃហិរញ្ញវត្ថុ</motion.p>
              <motion.h2 variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} className="mt-[clamp(0.5rem,1.5dvh,1rem)] text-[clamp(1.8rem,4.7dvh,3.1rem)] font-bold leading-[1.24] tracking-[-0.035em] text-[#003377] dark:text-white">
                គ្រប់គ្រងលុយរបស់អ្នក<br /><span className="relative inline-block">ដោយភាពជឿជាក់<motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="absolute -bottom-1 left-0 h-1.5 w-full origin-left rounded-full bg-[#FFC83D]" /></span>
              </motion.h2>
              <motion.p variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mx-auto mt-[clamp(0.75rem,2dvh,1.5rem)] max-w-md text-sm leading-6 text-[#334155] dark:text-slate-300">គ្រប់គ្រងចំណូល ចំណាយ និងគោលដៅរបស់អ្នកនៅកន្លែងតែមួយ។</motion.p>
            </motion.div>

            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: 0.65 } } }} className="mt-[clamp(0.75rem,2.2dvh,1.75rem)] flex flex-wrap justify-center gap-2.5">
              {highlights.map(({ icon: Icon, label }) => (
                <motion.div key={label} variants={{ hidden: { opacity: 0, y: 14, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1 } }} whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }} className="flex items-center gap-2 rounded-full border border-[#003377]/10 bg-white/65 px-3 py-2 text-xs font-bold shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.07]">
                  <span className="grid size-6 place-items-center rounded-full bg-[#FFC83D] text-[#003377]"><Icon className="size-3.5" /></span>{label}
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-[#334155]/60 dark:text-white/40">
            <p>© {new Date().getFullYear()} iSTASH</p>
            <p className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> ប្រព័ន្ធដំណើរការធម្មតា</p>
          </div>
        </aside>

        <div className="relative flex min-h-[100dvh] items-center justify-center overflow-y-auto overflow-x-hidden bg-[linear-gradient(155deg,#f8fafc_0%,#eef4fa_54%,#f7f9fc_100%)] px-4 py-4 dark:bg-[linear-gradient(155deg,#08111f_0%,#0a1728_54%,#08121f_100%)] sm:px-8 sm:py-5 lg:px-8 lg:py-3 xl:px-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00337708_1px,transparent_1px),linear-gradient(to_bottom,#00337708_1px,transparent_1px)] bg-[size:48px_48px] opacity-45 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#003377]/[0.055] blur-[90px] dark:bg-[#0f4c81]/15" />
          <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[12%] h-24 w-24 rounded-full bg-[#FFC83D]/10 blur-3xl dark:bg-[#FFC83D]/[0.06]" />
          <div className="relative z-10 w-full max-w-[29rem] py-2">{children}</div>
        </div>
      </div>
    </main>
  );
}
