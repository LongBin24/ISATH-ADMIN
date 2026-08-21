"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Settings,
  UserCog,
  Bot,
  Grid,
  Tags,
  Globe,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  User,
  LogOut,
  X,
  Sun,
  Moon,
  Globe2,
  ChevronRight,
} from "lucide-react";
import { useGetNotificationStatsQuery } from "@/features/notifications/api";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useTheme } from "@/hooks/use-theme";
import { useSignOut } from "@/features/auth/hook";
import { useGetProfileQuery } from "@/features/profile/api";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: stats } = useGetNotificationStatsQuery();
  const unreadCount = stats?.unreadCount || 0;
  const { locale, mounted: localeMounted, setLocale, t } = useAdminI18n();
  const { theme, mounted: themeMounted, toggleTheme } = useTheme();
  const signOut = useSignOut();
  const { data: profile } = useGetProfileQuery();

  const [moreOpen, setMoreOpen] = useState(false);

  // Close drawer whenever pathname changes
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Prevent background scroll when more drawer is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [moreOpen]);

  const primaryNavItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "AI Support", icon: Bot, href: "/ai-config" },
    { label: "Notifications", icon: Bell, href: "/notifications", badge: unreadCount },
    { label: "Users", icon: UserCog, href: "/user-manager" },
  ];

  const moreModules = [
    { label: "Categories", icon: Tags, href: "/categories" },
    { label: "Currencies", icon: Globe, href: "/currencies" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Alert Rules", icon: ShieldAlert, href: "/alert" },
    { label: "Reviews", icon: MessageSquare, href: "/feedback" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  const isMoreActive = moreModules.some(
    (m) => pathname === m.href || pathname.startsWith(`${m.href}/`)
  ) || pathname.startsWith("/profile");

  return (
    <>
      {/* Ultra-Clean Mobile Bottom Navigation Bar (PWA Standard) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 block lg:hidden border-t border-slate-200/60 bg-white/90 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.25rem)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/90 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.3)] font-google-sans transition-colors"
      >
        <div className="flex h-14 items-center justify-around px-1">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-all duration-150 active:scale-90 ${
                  isActive
                    ? "text-[#003377] dark:text-[#FFC83D]"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              >
                <div className="relative">
                  <Icon
                    size={21}
                    className={`transition-transform duration-200 ${
                      isActive ? "scale-105 stroke-[2.4]" : "stroke-[1.8]"
                    }`}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#FFC83D] px-1 text-[9px] font-extrabold text-[#003377] ring-2 ring-white dark:ring-slate-950">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight transition-all duration-150 ${
                    isActive ? "font-bold text-[#003377] dark:text-[#FFC83D]" : "font-medium"
                  }`}
                >
                  {t(item.label)}
                </span>
                {isActive && (
                  <span className="h-1 w-1 rounded-full bg-[#003377] dark:bg-[#FFC83D] animate-in fade-in" />
                )}
              </Link>
            );
          })}

          {/* More Trigger */}
          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            aria-expanded={moreOpen}
            aria-label={t("More options")}
            className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-all duration-150 active:scale-90 ${
              moreOpen || isMoreActive
                ? "text-[#003377] dark:text-[#FFC83D]"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            <Grid
              size={21}
              className={`transition-transform duration-200 ${
                moreOpen || isMoreActive ? "scale-105 stroke-[2.4]" : "stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[10px] tracking-tight transition-all duration-150 ${
                moreOpen || isMoreActive ? "font-bold text-[#003377] dark:text-[#FFC83D]" : "font-medium"
              }`}
            >
              {t("More")}
            </span>
            {(moreOpen || isMoreActive) && (
              <span className="h-1 w-1 rounded-full bg-[#003377] dark:bg-[#FFC83D] animate-in fade-in" />
            )}
          </button>
        </div>
      </nav>

      {/* Clean Mobile PWA Slide-up Drawer */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden font-google-sans">
          {/* Subtle Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMoreOpen(false)}
          />

          {/* Clean Card Sheet */}
          <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border-t border-slate-200/80 bg-white px-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-bottom">
            {/* Grab Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700" />

            {/* Profile Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3.5 dark:border-slate-800">
              <Link
                href="/profile"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-3 transition active:opacity-75"
              >
                <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-amber-300/60 bg-[#003377] text-[#FFC83D] shadow-sm">
                  {profile?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar}
                      alt={profile.displayName || t("Administrator")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {profile?.displayName || t("Administrator")}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {profile?.role || t("Administrator")}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                aria-label={t("Close")}
              >
                <X size={15} />
              </button>
            </div>

            {/* Quick Switchers */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocale(locale === "en" ? "km" : "en")}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 py-2 px-3 text-xs font-semibold text-slate-700 transition active:scale-95 hover:border-[#003377] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-[#FFC83D]"
              >
                <Globe2 size={14} className="text-[#003377] dark:text-[#FFC83D]" />
                <span>{localeMounted ? (locale === "km" ? "ខ្មែរ" : "English") : "Language"}</span>
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 py-2 px-3 text-xs font-semibold text-slate-700 transition active:scale-95 hover:border-[#003377] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-[#FFC83D]"
              >
                {themeMounted && theme === "dark" ? (
                  <>
                    <Sun size={14} className="text-[#FFC83D]" />
                    <span>{t("Light Mode")}</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-[#003377]" />
                    <span>{t("Dark Mode")}</span>
                  </>
                )}
              </button>
            </div>

            {/* Modules Grid */}
            <div className="mb-4 space-y-2">
              <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("Admin Features")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {moreModules.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex items-center gap-2.5 rounded-xl p-2.5 border transition-all duration-150 active:scale-95 ${
                        isActive
                          ? "border-[#003377]/40 bg-[#003377]/5 text-[#003377] font-bold dark:border-[#FFC83D]/40 dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]"
                          : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800/60 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div
                        className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                          isActive
                            ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-[#003377]"
                            : "bg-white text-slate-500 shadow-2xs dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="truncate text-xs font-semibold">{t(item.label)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sign Out Action */}
            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                signOut();
              }}
              className="flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50/50 p-2.5 text-xs font-semibold text-red-600 transition active:scale-95 hover:bg-red-100 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400"
            >
              <div className="flex items-center gap-2">
                <LogOut size={14} />
                <span>{t("Sign out")}</span>
              </div>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
