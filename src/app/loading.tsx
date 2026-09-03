"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AppLoadingProps = {
  complete?: boolean;
  onComplete?: () => void;
};

export function AppLoading({ complete, onComplete }: AppLoadingProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!complete) return;

    const showCompleteTimer = window.setTimeout(() => setProgress(100), 0);
    const finishTimer = window.setTimeout(() => onCompleteRef.current?.(), 180);

    return () => {
      window.clearTimeout(showCompleteTimer);
      window.clearTimeout(finishTimer);
    };
  }, [complete]);

  useEffect(() => {
    if (complete) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isControlled = complete !== undefined;
    const maximumWhileWaiting = isControlled ? 90 : 100;

    if (prefersReducedMotion) {
      const reducedMotionTimer = window.setTimeout(() => {
        setProgress(maximumWhileWaiting);
        if (!isControlled) onCompleteRef.current?.();
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= maximumWhileWaiting - 1) {
          window.clearInterval(timer);
          if (!isControlled) {
            window.setTimeout(() => onCompleteRef.current?.(), 0);
          }
          return maximumWhileWaiting;
        }

        return current + 1;
      });
    }, 30);

    return () => window.clearInterval(timer);
  }, [complete]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f7f9fc] px-6 font-['Google_Sans','Kantumruy_Pro','Battambang',sans-serif] dark:bg-[#050b14]">
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-[#FFC83D]/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 size-96 rounded-full bg-[#003377]/12 blur-3xl dark:bg-[#FFC83D]/8" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,51,119,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,51,119,0.035)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,200,61,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,200,61,0.025)_1px,transparent_1px)]" />

      <section
        role="progressbar"
        aria-label="កំពុងផ្ទុក iSTASH"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="relative w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative grid size-36 place-items-center sm:size-40">
            <span className="absolute inset-3 animate-ping rounded-full bg-[#FFC83D]/10 [animation-duration:1.8s]" />
            <span className="absolute inset-0 rounded-full border border-[#003377]/10 dark:border-[#FFC83D]/10" />
            <span className="absolute inset-4 rounded-full border border-[#FFC83D]/25" />

            <div className="relative animate-[bounce_1.4s_ease-in-out_infinite] drop-shadow-[0_18px_24px_rgba(0,51,119,0.2)] dark:drop-shadow-[0_18px_24px_rgba(255,200,61,0.12)]">
              <Image
                src="/istash-v1.png"
                alt="iSTASH"
                width={112}
                height={112}
                priority
                className="size-24 object-contain dark:hidden sm:size-28"
              />
              <Image
                src="/Dark_Mode_Logo.png"
                alt="iSTASH"
                width={112}
                height={112}
                priority
                className="hidden size-24 object-contain dark:block sm:size-28"
              />
            </div>
          </div>

          <div className="mt-8 flex items-baseline justify-center text-[#003377] dark:text-white">
            <span className="min-w-[3ch] text-right text-6xl font-black tabular-nums tracking-[-0.06em] sm:text-7xl">
              {progress}
            </span>
            <span className="ml-1 text-xl font-black text-[#FFC83D] sm:text-2xl">
              %
            </span>
          </div>

          <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">
            កំពុងរៀបចំ iSTASH
          </p>

          <div className="mt-7 h-2.5 w-full overflow-hidden rounded-full bg-[#003377]/10 shadow-inner dark:bg-white/10">
            <div
              className="relative h-full rounded-full bg-[linear-gradient(90deg,#FFC83D,#f5b91f)] transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute right-0 top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,200,61,0.65)]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AppLoading;
