"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7f9fc] px-4 py-10 font-['Google_Sans','Kantumruy_Pro','Battambang',sans-serif] dark:bg-[#050b14] sm:px-6">
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-[#FFC83D]/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 size-96 rounded-full bg-[#003377]/12 blur-3xl dark:bg-[#FFC83D]/8" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,51,119,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,51,119,0.035)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,200,61,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,200,61,0.025)_1px,transparent_1px)]" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[#003377]/10 bg-white/90 shadow-[0_28px_80px_-40px_rgba(0,51,119,0.4)] backdrop-blur-xl dark:border-white/10 dark:bg-[#081321]/90">
        <div className="h-1.5 w-full bg-[linear-gradient(90deg,#FFC83D_0_28%,#003377_28%_100%)]" />
        <div className="relative px-6 py-10 sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-12 size-52 rounded-full border-[28px] border-[#FFC83D]/10 sm:size-64"
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-7 flex items-center justify-center gap-4">
              <span className="text-7xl font-black leading-none tracking-[-0.08em] text-[#003377] dark:text-[#FFC83D] sm:text-8xl">
                404
              </span>
            </div>

            <h1 className="max-w-md text-3xl font-black leading-tight tracking-tight text-[#003377] dark:text-white sm:text-4xl">
              រកមិនឃើញទំព័រនេះទេ
            </h1>

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f5b91f] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">←</span>
                ត្រឡប់ទៅទំព័រមុន
              </button>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#003377]/20 bg-transparent px-5 text-sm font-bold text-[#003377] transition hover:border-[#003377]/40 hover:bg-[#003377]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2 dark:border-white/20 dark:text-white dark:hover:bg-white/5"
              >
                ទៅផ្ទាំងគ្រប់គ្រង
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
