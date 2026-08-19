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
import { usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { useI18n } from "@/hooks/use-i18n";
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

import LanguageSwitcher from "@/components/language-switcher";

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
  isSidebarCollapsed?: boolean;
}

<<<<<<< HEAD
export default function Navbar({
  onMenuToggle,
  isSidebarOpen = false,
  isSidebarCollapsed = false,
}: NavbarProps) {
=======
export default function Navbar({ onMenuToggle, isSidebarOpen = false }: NavbarProps) {
  const { locale, dict } = useI18n();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
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
<<<<<<< HEAD
            <Globe2 size={18} />
            <span className="hidden sm:inline font-semibold">
              {localeMounted ? (locale === "km" ? "ខ្មែរ" : "EN") : "EN"}
            </span>
          </Button>
          <Button
=======
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={dict.common.search}
            className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#FFC83D] focus:ring-2 focus:ring-[#FFC83D]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 font-google-sans"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <LanguageSwitcher />

          <button
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
<<<<<<< HEAD
            className="size-10 rounded-xl text-slate-600 hover:text-[#003377] dark:text-slate-300"
            aria-label={t("Toggle theme")}
            title={t("Toggle theme")}
=======
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D]"
            aria-label="Toggle theme"
            title={dict.common.toggleTheme}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          >
            {mounted && theme === "dark" ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </Button>

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

<<<<<<< HEAD
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
=======
          <Link href={`/${locale}/profile`} className="flex items-center gap-3 border-l border-slate-200 pl-2 sm:pl-3.5 dark:border-slate-800 hover:opacity-85 transition">
            <div className="hidden text-right sm:block font-google-sans">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile?.displayName || "ចាន់ សូធា"}
              </p>
              <p className="text-[11px] text-slate-500">
                {profile?.role || dict.common.adminRole}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
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
<<<<<<< HEAD
=======

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/50 dark:hover:text-red-400"
            aria-label="Sign out"
            title={dict.common.signOut}
          >
            <LogOut size={18} />
          </button>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
        </div>
      </div>
    </header>
  );
}
