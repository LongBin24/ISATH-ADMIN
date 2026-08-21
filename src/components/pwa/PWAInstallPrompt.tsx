"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, Smartphone } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  const { t } = useAdminI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return; // Already running as PWA
    }

    // Check if user dismissed previously
    const isDismissed = localStorage.getItem("istash_pwa_dismissed");
    if (isDismissed) {
      return;
    }

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Listen for BeforeInstallPrompt event (Android / Brave / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's default automated infobar so custom UI banner can be displayed
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    const handleAppInstalled = () => {
      console.log("[PWA] App successfully installed!");
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Show banner for iOS if not installed
    if (isIOS) {
      setShowInstallBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    // Trigger native browser install prompt dialog on user action
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("istash_pwa_dismissed", "true");
  };

  if (!showInstallBanner) return null;

  return (
    <>
      {/* Floating Bottom Mobile Install Banner */}
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-40 max-w-sm animate-in slide-in-from-bottom duration-300 font-google-sans">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3 text-slate-800 shadow-xl backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 dark:text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#003377] text-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377] font-bold shadow-2xs">
              <Smartphone size={18} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {t("Install iStash Admin on Mobile")}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {t("Fast, native mobile experience with notifications.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1 rounded-xl bg-[#FFC83D] px-3 py-1.5 text-xs font-bold text-[#003377] shadow-sm transition hover:bg-[#f0ba33] active:scale-95"
            >
              <Download size={13} />
              <span>{t("Install")}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label={t("Dismiss")}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in font-google-sans">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-google-sans">
                {t("How to install on iOS (iPhone / iPad)")}
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-google-sans">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  <Share2 size={16} />
                </div>
                <p>1. {t("Tap the Share button in Safari toolbar")}</p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                  <PlusSquare size={16} />
                </div>
                <p>2. {t('Select "Add to Home Screen"')}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-2xl bg-[#003377] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255] dark:bg-[#FFC83D] dark:text-[#003377] dark:hover:bg-[#f7c948]"
            >
              {t("Got it")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
