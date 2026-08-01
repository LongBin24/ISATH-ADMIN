import Link from "next/link";
import { LayoutDashboard, Tags, Globe, Bot, Settings, MessageSquare, Bell } from "lucide-react";

const navItems = [
  { label: "ផ្ទាំងគ្រប់គ្រង", icon: LayoutDashboard, href: "/dashboard" },
  { label: "ប្រភេទ", icon: Tags, href: "/categories" },
  { label: "រូបិយបណ្ណ", icon: Globe, href: "/currencies" },
  { label: "ជំនួយ AI", icon: Bot, href: "/ai-config" },
  { label: "ការកំណត់", icon: Settings, href: "/settings" },
  { label: "មតិ", icon: MessageSquare, href: "/feedback" },
  { label: "ការជូនដំណឹង", icon: Bell, href: "/notifications" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-8">
      <div className="text-2xl font-bold text-[#003377] dark:text-[#FFC83D] flex items-center gap-2">
        <div className="w-8 h-8 bg-[#FFC83D] rounded-lg" /> iStash
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400 hover:text-[#003377] dark:hover:text-[#FFC83D] font-google">
            <item.icon size={20} />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}