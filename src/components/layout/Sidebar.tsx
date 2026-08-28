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
  Mail,
  Bell,
  UserCog,
  X,
  ShieldAlert,
  ScrollText,
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
  { label: "Contact Us", icon: Mail, href: "/contact-us" },
  { label: "Audit Logs", icon: ScrollText, href: "/audit-logs" },
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
        className={`fixed left-0 top-0 z-40 flex h-screen w-65 flex-col gap-8 border-r border-slate-200/80 bg-white p-6 transition-transform duration-300 dark:border-[#172338] dark:bg-[#070d18] ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isCollapsed ? "lg:-translate-x-full" : "lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#003377] dark:text-[#FFC83D]">
            <Image
              src="/iStash-logo (3).png"
              alt="Logo"
              width={44}
              height={44}
              className="h-11 w-11 object-contain dark:hidden"
              priority
            />
            <Image
              src="/icons/Dark_Mode_Logo.png"
              alt="Logo"
              width={44}
              height={44}
              className="hidden h-11 w-11 object-contain dark:block"
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
                className={`flex items-center gap-3 rounded-xl p-3 transition-all ${isActive ? "bg-[#003377]/10 font-bold text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D] dark:shadow-[0_0_15px_-3px_rgba(255,200,61,0.15)]" : "text-slate-600 hover:bg-slate-50 hover:text-[#003377] dark:text-slate-400 dark:hover:bg-[#0b1120] dark:hover:text-[#FFC83D]"} font-google-sans`}
              >
                <item.icon size={20} />
                <span className="text-base font-medium">{t(item.label)}</span>
              </Link>
            );
          })}
        </nav>

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
