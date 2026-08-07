"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tags, Globe, Bot, Settings, MessageSquare, Bell, UserCog, X } from "lucide-react";

const navItems = [
  { label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard, href: "/dashboard" },
  { label: "ប្រភេទ", icon: Tags, href: "/categories" },
  { label: "រូបិយបណ្ណ", icon: Globe, href: "/currencies" },
  { label: "ជំនួយ AI", icon: Bot, href: "/ai-config" },
  { label: "អ្នកប្រើប្រាស់", icon: UserCog, href: "/user-manager" },
  { label: "មតិ", icon: MessageSquare, href: "/feedback" },
  { label: "ការជូនដំណឹង", icon: Bell, href: "/notifications" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-65 flex-col gap-8 border-r border-slate-200 bg-slate-50 p-6 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-[#003377] dark:text-[#FFC83D]">
            <Image src="/logo.png" alt="Logo" width={44} height={44} />
            <span>iStash</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-200 hover:text-[#003377] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D] lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl p-3 transition-all ${isActive ? "bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D]" : "text-slate-600 hover:bg-white hover:text-[#003377] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-[#FFC83D]"} font-google-sans`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}