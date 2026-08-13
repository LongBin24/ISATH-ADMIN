"use client";

import { Search, Moon, Sun, User, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
import NotificationBellDropdown from "@/features/notifications/components/NotificationBellDropdown";
import AlertBellDropdown from "@/features/alert/components/AlertBellDropdown";
import { useGetProfileQuery } from "@/features/profile/api";

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onMenuToggle, isSidebarOpen = false }: NavbarProps) {
  const { theme, mounted, toggleTheme } = useTheme();
  const { data: profile } = useGetProfileQuery();

  function handleSignOut() {
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("idToken");
    window.sessionStorage.removeItem("accessToken");
    window.sessionStorage.removeItem("token");
    document.cookie = "accessToken=; Max-Age=0; path=/";
    window.location.assign("/api/keycloak/logout");
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:bg-slate-900 dark:border-slate-800 sm:px-6 lg:px-8">
      <div className="flex h-full w-full items-center justify-between gap-3">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-xs transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D]"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ស្វែងរក..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-[#FFC83D] focus:ring-2 focus:ring-[#FFC83D]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 font-google-sans"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D]"
            aria-label="Toggle theme"
            title="ផ្លាស់ប្តូររូបរាង (Toggle theme)"
          >
            {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Admin System Alert Dropdown Icon */}
          <AlertBellDropdown />

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

          <Link href="/profile" className="flex items-center gap-3 border-l border-slate-200 pl-2 sm:pl-3.5 dark:border-slate-800 hover:opacity-85 transition">
            <div className="hidden text-right sm:block font-google-sans">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile?.displayName || "ចាន់ សូធា"}
              </p>
              <p className="text-[11px] text-slate-500">
                {profile?.role || "អ្នកគ្រប់គ្រងប្រព័ន្ធ"}
              </p>
            </div>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#FFC83D] bg-[#003377] text-[#FFC83D] shadow-xs">
              {profile?.avatar ? (
                <img
                  key={profile.avatar}
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User size={20} />
                </div>
              )}
            </div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-red-300 hover:text-red-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500/50 dark:hover:text-red-400"
            aria-label="Sign out"
            title="ចាកចេញពីប្រព័ន្ធ (Sign out)"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
