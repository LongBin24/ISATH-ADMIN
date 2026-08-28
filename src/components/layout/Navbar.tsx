"use client";

import {
  Search,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import NotificationBellDropdown from "@/features/notifications/components/NotificationBellDropdown";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { LanguageFlag } from "@/components/ui/LanguageFlag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetProfileQuery } from "@/features/profile/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
  isSidebarCollapsed?: boolean;
}

export default function Navbar({
  onMenuToggle,
  isSidebarOpen = false,
  isSidebarCollapsed = false,
}: NavbarProps) {
  const { data: profile } = useGetProfileQuery();
  const { locale, mounted: localeMounted, setLocale, t } = useAdminI18n();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/70 bg-white/85 px-3.5 py-3.5 backdrop-blur-md dark:border-[#172338] dark:bg-[#070d18]/90 sm:px-5 sm:py-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-1 items-center gap-2.5 sm:gap-3.5">
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="size-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label={t(
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                )}
              >
                <span className="hidden lg:inline-flex">
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen size={20} />
                  ) : (
                    <PanelLeftClose size={20} />
                  )}
                </span>
                <span className="inline-flex lg:hidden">
                  {isSidebarOpen ? (
                    <PanelLeftClose size={20} />
                  ) : (
                    <PanelLeftOpen size={20} />
                  )}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t(isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
            </TooltipContent>
          </Tooltip>

          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={18}
            />
            <Input
              type="text"
              placeholder={t("Search...")}
              className="h-10 w-full rounded-xl border border-slate-200/70 bg-slate-50/70 pl-10 pr-3.5 text-sm font-normal font-google-sans hover:bg-slate-100/70 focus:border-[#003377] focus:bg-white dark:border-slate-800/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:focus:border-[#FFC83D] dark:focus:bg-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-3.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setLocale(locale === "en" ? "km" : "en")}
            className="h-10 gap-2 rounded-xl px-3 text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
            aria-label={t("Switch language")}
            title={
              locale === "km"
                ? t("Switch to English")
                : t("Switch to Khmer")
            }
          >
            <LanguageFlag locale={localeMounted ? locale : "en"} className="w-5 h-3.5" />
            <span className="text-sm font-semibold">
              {localeMounted ? (locale === "km" ? "ខ្មែរ" : "EN") : "EN"}
            </span>
          </Button>

          {/* Theme Toggle with Radial Wave & Button Animation */}
          <ThemeToggle variant="ghost" size="md" className="size-10 rounded-xl" />

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

          <Link
            href="/profile"
            className="flex items-center gap-3.5 border-l border-slate-200/80 pl-3 transition hover:opacity-85 dark:border-slate-800 sm:pl-4"
          >
            <div className="hidden text-right font-google-sans sm:block space-y-0.5">
              <p className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {profile?.displayName || t("Administrator")}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                {profile?.role || t("Administrator")}
              </p>
            </div>
            <div className="relative grid size-11 place-items-center overflow-hidden rounded-full border-2 border-amber-300/90 bg-[#003377] text-[#FFC83D] shadow-sm">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.displayName || t("Administrator")}
                  className="size-full object-cover"
                />
              ) : (
                <User size={22} />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
