"use client";

import { ChevronRight, UserCog, Bot, Tags, Globe } from "lucide-react";
import Link from "next/link";
<<<<<<< HEAD
import { useAdminI18n } from "@/i18n/admin-i18n";

export default function QuickMenu() {
  const { t } = useAdminI18n();

  const menuItems = [
    { label: t("User Management"), icon: UserCog, href: "/user-manager" },
    { label: t("AI Configuration"), icon: Bot, href: "/ai-config" },
    { label: t("Categories"), icon: Tags, href: "/categories" },
    { label: t("Currencies"), icon: Globe, href: "/currencies" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-bold mb-4 font-google-sans text-[#003377] dark:text-white">
        {t("Quick Module")}
=======
import { useI18n } from "@/hooks/use-i18n";

export default function QuickMenu() {
  const { locale, dict } = useI18n();

  const menuItems = [
    { label: dict.users.title, icon: UserCog, href: "/users" },
    { label: dict.aiConfig.title, icon: Bot, href: "/ai-config" },
    { label: dict.nav.categories, icon: Tags, href: "/categories" },
    { label: dict.currencies.title, icon: Globe, href: "/currencies" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-google-sans">
      <h3 className="text-lg font-bold mb-4 text-[#003377] dark:text-white">
        {dict.common.quickModule}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
      </h3>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
<<<<<<< HEAD
            href={item.href}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors group"
=======
            href={`/${locale}${item.href}`}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-[#FFC83D]/20 transition-colors">
                <item.icon
                  size={20}
                  className="text-slate-600 dark:text-slate-400 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]"
                />
              </div>
              <span className="text-sm text-slate-700 dark:text-slate-300 dark:group-hover:text-[#FFC83D]">
                {item.label}
              </span>
            </div>
            <ChevronRight size={18} className="text-slate-400 dark:group-hover:text-[#FFC83D] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
