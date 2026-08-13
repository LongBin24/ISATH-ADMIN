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
    <header className="sticky top-0 z-20 h-22 sm:h-27 w-full border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-slate-900 dark:border-slate-800 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Toggle navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ស្វែងរក..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-[#FFC83D] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 font-google-sans"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Admin System Alert Dropdown Icon */}
          <AlertBellDropdown />

          {/* User Notifications Dropdown Icon */}
          <NotificationBellDropdown />

          <Link href="/profile" className="flex items-center gap-3 border-l border-slate-200 pl-2 sm:pl-4 dark:border-slate-800 hover:opacity-80 transition">
            <div className="hidden text-right sm:block font-google-sans">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {profile?.displayName || "ចាន់ សូធា"}
              </p>
              <p className="text-xs text-slate-500">
                {profile?.role || "អ្នកគ្រប់គ្រងប្រព័ន្ធ"}
              </p>
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#FFC83D] bg-[#003377] text-[#FFC83D] shadow-sm">
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
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:text-[#003377] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
