"use client";

import {
  Search,
  Moon,
  Sun,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
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
  const { theme, mounted, toggleTheme } = useTheme();
  const { data: profile } = useGetProfileQuery();
  const { locale, mounted: localeMounted, setLocale, t } = useAdminI18n();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/60 bg-white/90 px-3 pt-[max(env(safe-area-inset-top,0px),0.5rem)] pb-2 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/90 sm:px-4 lg:px-5">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex flex-1 items-center gap-2 sm:gap-3">
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="size-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label={t(
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar",
                )}
              >
                <span className="hidden lg:inline-flex">
                  {isSidebarCollapsed ? (
                    <PanelLeftOpen size={18} />
                  ) : (
                    <PanelLeftClose size={18} />
                  )}
                </span>
                <span className="inline-flex lg:hidden">
                  {isSidebarOpen ? (
                    <PanelLeftClose size={18} />
                  ) : (
                    <PanelLeftOpen size={18} />
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={16}
            />
            <Input
              type="text"
              placeholder={t("Search...")}
              className="h-9 w-full rounded-xl border border-slate-200/70 bg-slate-50/70 pl-9 pr-3 text-xs font-normal font-google-sans hover:bg-slate-100/70 focus:border-[#003377] focus:bg-white dark:border-slate-800/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:focus:border-[#FFC83D] dark:focus:bg-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setLocale(locale === "en" ? "km" : "en")}
            className="h-9 gap-2 rounded-xl px-2.5 text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
            aria-label={t("Switch language")}
            title={
              locale === "km"
                ? t("Switch to English")
                : t("Switch to Khmer")
            }
          >
            <LanguageFlag locale={localeMounted ? locale : "en"} className="w-5 h-3.5" />
            <span className="text-xs font-semibold">
              {localeMounted ? (locale === "km" ? "ខ្មែរ" : "EN") : "EN"}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
            aria-label={t("Toggle theme")}
            title={t("Toggle theme")}
          >
            {mounted && theme === "dark" ? (
              <Sun size={18} className="text-[#FFC83D]" />
            ) : (
              <Moon size={18} className="text-[#003377]" />
            )}
          </Button>

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

          <Link
            href="/profile"
            className="flex items-center gap-2.5 border-l border-slate-200/80 pl-2 transition hover:opacity-80 dark:border-slate-800 sm:pl-3"
          >
            <div className="hidden text-right font-google-sans sm:block">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {profile?.displayName || t("Administrator")}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {profile?.role || t("Administrator")}
              </p>
            </div>
            <div className="relative grid size-8.5 place-items-center overflow-hidden rounded-full border border-amber-300/80 bg-[#003377] text-[#FFC83D] shadow-2xs">
              {profile?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.displayName || t("Administrator")}
                  className="size-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
