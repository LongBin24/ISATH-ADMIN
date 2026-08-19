"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  Globe,
  Bot,
  MessageSquare,
  Bell,
  UserCog,
  X,
<<<<<<< HEAD
  ShieldAlert,
  LogOut,
} from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useSignOut } from "@/features/auth/hook";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Categories", icon: Tags, href: "/categories" },
  { label: "Currencies", icon: Globe, href: "/currencies" },
  { label: "AI Support", icon: Bot, href: "/ai-config" },
  { label: "Users", icon: UserCog, href: "/user-manager" },
  { label: "Reviews", icon: MessageSquare, href: "/feedback" },
  { label: "Alert Rules", icon: ShieldAlert, href: "/alert" },
  { label: "Notifications", icon: Bell, href: "/notifications" },
];

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = true,
  isCollapsed = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { t } = useAdminI18n();
  const signOut = useSignOut();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-65 flex-col gap-8 border-r border-slate-200 bg-slate-50 p-6 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#003377] dark:text-[#FFC83D]">
            <Image
              src="/iStash-logo (3).png"
              alt="Logo"
              width={44}
              height={44}
              className="h-auto w-auto"
              priority
            />
            <span>iStash</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-xl text-slate-500 hover:text-[#003377] dark:hover:text-[#FFC83D] lg:hidden"
            aria-label={t("Close")}
          >
            <X size={18} />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all ${isActive ? "bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]" : "text-slate-600 hover:bg-white hover:text-[#003377] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"} font-google-sans`}
              >
                <item.icon size={20} />
                <span className="text-base font-medium">{t(item.label)}</span>
=======
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname() || "";
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
    { label: dict.nav.categories, icon: Tags, href: "/categories" },
    { label: dict.nav.currencies, icon: Globe, href: "/currencies" },
    { label: dict.nav.aiConfig, icon: Bot, href: "/ai-config" },
    { label: dict.nav.users, icon: UserCog, href: "/users" },
    { label: dict.nav.feedback, icon: MessageSquare, href: "/feedback" },
    { label: dict.nav.notifications, icon: Bell, href: "/notifications" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-65 flex-col gap-8 border-r border-slate-200 bg-slate-50 p-6 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-2xl font-bold text-[#003377] dark:text-[#FFC83D]"
          >
            <Image
              src="/iStash-logo (3).png"
              alt="Logo"
              width={44}
              height={44}
              className="h-auto w-auto"
              priority
            />
            <span>iStash</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-200 hover:text-[#003377] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const localizedHref = `/${locale}${item.href}`;
            const isActive =
              normalizedPath === item.href ||
              (item.href !== "/" && normalizedPath.startsWith(`${item.href}/`)) ||
              (item.href === "/dashboard" &&
                (normalizedPath === "" || normalizedPath === "/"));

            return (
              <Link
                key={item.href}
                href={localizedHref}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all font-google-sans ${
                  isActive
                    ? "bg-[#FFC83D]/20 text-[#003377] font-bold dark:text-[#FFC83D] shadow-xs"
                    : "text-slate-600 hover:bg-white hover:text-[#003377] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-[#003377] dark:text-[#FFC83D]" : ""} />
                <span className="text-sm font-medium">{item.label}</span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
              </Link>
            );
          })}
        </nav>
<<<<<<< HEAD

        <div className="border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => signOut()}
            className="h-11 w-full justify-start gap-3 rounded-xl text-slate-600 hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive dark:text-slate-300"
            aria-label={t("Sign out")}
          >
            <LogOut size={20} />
            <span className="text-base font-medium">{t("Sign out")}</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
=======
      </aside>
    </>
  );
}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
