'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import SystemStatePage from '@/components/system/SystemStatePage';

type ErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
};

function isNetworkError(error: Error): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return true;
  }

  const message = (error?.message || '').toLowerCase();
  const name = (error?.name || '').toLowerCase();

  const networkKeywords = [
    'network error',
    'failed to fetch',
    'fetch failed',
    'networkerror',
    'err_network',
    'err_connection',
    'err_internet_disconnected',
    'econnrefused',
    'enotfound',
    'net::err',
    'load failed',
  ];

  return networkKeywords.some((kw) => message.includes(kw) || name.includes(kw));
}

export default function ErrorPage({ error, reset, unstable_retry }: ErrorProps) {
  useEffect(() => {
    console.error('[app-error]', error);
  }, [error]);

  const retry = () => {
    if (unstable_retry) {
      unstable_retry();
      return;
    }

    reset?.();
  };

  const isNetwork = useMemo(() => isNetworkError(error), [error]);

  if (isNetwork) {
    return <SystemStatePage kind="network" onRetry={retry} />;
  }

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
              <span className="text-7xl font-black leading-none tracking-[-0.08em] text-[#003377] dark:text-white sm:text-8xl">
                500
              </span>
            </div>

            <h1 className="max-w-md text-3xl font-black leading-tight tracking-tight text-[#003377] dark:text-white sm:text-4xl">
              មានបញ្ហាមួយបានកើតឡើង
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              សូមអភ័យទោស ប្រព័ន្ធមិនអាចបញ្ចប់សំណើរបស់អ្នកបានទេ។ សូមសាកល្បងម្តងទៀត។
            </p>

            {error.digest && (
              <div className="mt-5 w-fit rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                លេខយោងកំហុស៖ <span className="font-mono">{error.digest}</span>
              </div>
            )}

            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={retry}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#FFC83D] px-5 text-sm font-bold text-[#003377] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f5b91f] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2"
              >
                <span aria-hidden="true">↻</span>
                សាកល្បងម្តងទៀត
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
