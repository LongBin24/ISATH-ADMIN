"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, Settings, UserCog, BarChart3 } from "lucide-react";
import { useGetNotificationStatsQuery } from "@/features/notifications/api";
import { getDictionary } from "@/lib/i18n";

export default function MobileBottomNav() {
  const pathname = usePathname() || "";
  const { data: stats } = useGetNotificationStatsQuery();
  const unreadCount = stats?.unreadCount || 0;

  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] === "en" ? "en" : "kh";
  const normalizedPath =
    "/" +
    (segments[0] === "en" || segments[0] === "kh"
      ? segments.slice(1).join("/")
      : segments.join("/"));

  const dict = getDictionary(locale);

  const navItems = [
    { label: dict.nav.dashboard, icon: LayoutDashboard, href: "/dashboard" },
    { label: dict.nav.reports, icon: BarChart3, href: "/reports" },
    { label: dict.nav.notifications, icon: Bell, href: "/notifications", badge: unreadCount },
    { label: dict.nav.users, icon: UserCog, href: "/users" },
    { label: dict.nav.settings, icon: Settings, href: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 block lg:hidden border-t border-slate-200/80 bg-white/90 px-2 py-1.5 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90 shadow-lg font-google-sans">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const localizedHref = `/${locale}${item.href}`;
          const isActive =
            normalizedPath === item.href ||
            (item.href !== "/" && normalizedPath.startsWith(`${item.href}/`)) ||
            (item.href === "/dashboard" &&
              (normalizedPath === "" || normalizedPath === "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={localizedHref}
              className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition ${
                isActive
                  ? "text-[#003377] dark:text-[#FFC83D] font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "scale-110 transition" : ""} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC83D] text-[9px] font-bold text-[#003377] ring-2 ring-white dark:ring-slate-950">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
