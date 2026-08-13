"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, Settings, UserCog, BarChart3 } from "lucide-react";
import { useGetNotificationStatsQuery } from "@/features/notifications/api";
import { useAdminI18n } from "@/i18n/admin-i18n";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: stats } = useGetNotificationStatsQuery();
  const unreadCount = stats?.unreadCount || 0;
  const { t } = useAdminI18n();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Reports", icon: BarChart3, href: "/reports" },
    { label: "Notifications", icon: Bell, href: "/notifications", badge: unreadCount },
    { label: "Users", icon: UserCog, href: "/user-manager" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 block lg:hidden border-t border-slate-200/80 bg-white/90 px-2 py-1.5 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90 shadow-lg font-google-sans">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 transition ${
                isActive
                  ? "text-[#003377] dark:text-[#FFC83D] font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? "scale-110 transition" : ""} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC83D] text-xs font-bold text-[#003377] ring-2 ring-white dark:ring-slate-950">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium leading-tight">{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
