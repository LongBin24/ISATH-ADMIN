"use client";

import {
  Search,
  Moon,
  Sun,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Globe2,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
import NotificationBellDropdown from "@/features/notifications/components/NotificationBellDropdown";
import { useAdminI18n } from "@/i18n/admin-i18n";
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
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/80 px-3 py-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 sm:px-4 lg:px-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <Tooltip>
            <TooltipTrigger>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                className="size-9 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground"
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

          <div className="relative w-full max-w-sm sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              type="text"
              placeholder={t("Search...")}
              className="h-10 w-full rounded-xl bg-muted pl-10 pr-3 text-base font-normal font-google-sans"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setLocale(locale === "en" ? "km" : "en")}
            className="h-10 gap-2 rounded-xl px-3 text-slate-600 hover:text-[#003377] dark:text-slate-300"
            aria-label={t("Switch language")}
            title={
              locale === "km"
                ? t("Switch to English")
                : t("Switch to Khmer")
            }
          >
            <Globe2 size={18} />
            <span className="hidden sm:inline font-semibold">
              {localeMounted ? (locale === "km" ? "ខ្មែរ" : "EN") : "EN"}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="size-10 rounded-xl text-slate-600 hover:text-[#003377] dark:text-slate-300"
            aria-label={t("Toggle theme")}
            title={t("Toggle theme")}
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </Button>

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

          <Link
            href="/profile"
            className="flex items-center gap-3 border-l border-border pl-2 transition hover:opacity-80 sm:pl-4"
          >
            <div className="hidden text-right font-google-sans sm:block">
              <p className="text-base font-medium text-foreground">
                {profile?.displayName || t("Administrator")}
              </p>
              <p className="text-sm text-muted-foreground font-normal">
                {profile?.role || t("Administrator")}
              </p>
            </div>
            <div className="relative grid size-10 place-items-center overflow-hidden rounded-full border-2 border-[#FFC83D] bg-[#003377] text-[#FFC83D] shadow-sm">
              {profile?.avatar ? (
                // The profile API can return arbitrary remote/data URLs that are not known at build time.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar}
                  alt={profile.displayName || t("Administrator")}
                  className="size-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
