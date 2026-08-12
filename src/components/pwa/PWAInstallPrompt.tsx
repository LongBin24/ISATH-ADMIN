"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, Smartphone, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
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
      <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-40 max-w-md animate-in slide-in-from-bottom duration-300 font-google-sans">
        <div className="flex items-center justify-between gap-3 rounded-3xl bg-gradient-to-r from-[#003377] to-slate-900 p-4 text-white shadow-2xl border border-slate-700/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFC83D] text-[#003377] font-extrabold shadow-md">
              <Smartphone size={22} />
            </div>

            <div>
              <div className="flex items-center gap-1">
                <Sparkles size={12} className="text-[#FFC83D]" />
                <h4 className="text-xs font-bold text-[#FFC83D] uppercase tracking-wider font-google-sans">
                  កម្មវិធីទូរស័ព្ទ iStash
                </h4>
              </div>
              <p className="text-xs font-bold text-white font-google-sans">
                ដំឡើងកម្មវិធី iStash លើទូរស័ព្ទដៃ
              </p>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                ប្រើប្រាស់លឿន ងាយស្រួល និងទទួលបានការជូនដំណឹង
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FFC83D] px-3.5 py-2 text-xs font-bold text-[#003377] shadow-lg shadow-[#FFC83D]/20 transition hover:bg-[#e0ac2b] active:scale-95"
            >
              <Download size={14} />
              <span>ដំឡើង</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
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
                របៀបដំឡើង iStash លើ iPhone / iPad
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
                <p>1. ចុចលើសញ្ញា <span className="font-bold text-[#003377] dark:text-[#FFC83D]">ចែករំលែក (Share)</span> នៅខាងក្រោមនៃកម្មវិធី Safari</p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                  <PlusSquare size={16} />
                </div>
                <p>2. ជ្រើសរើស <span className="font-bold text-[#003377] dark:text-[#FFC83D]">"បន្ថែមទៅអេក្រង់ដើម"</span></p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-2xl bg-[#003377] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002255]"
            >
              យល់ព្រម
            </button>
          </div>
        </div>
      )}
    </>
  );
}
