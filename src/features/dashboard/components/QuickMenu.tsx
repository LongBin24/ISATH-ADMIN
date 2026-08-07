import { ChevronRight, UserCog, Bot, Tags, Globe } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { label: "ការគ្រប់គ្រងអ្នកប្រើប្រាស់", icon: UserCog, href: "/user-manager" },
  { label: "ការកំណត់ AI", icon: Bot, href: "/ai-config" },
  { label: "ប្រភេទ", icon: Tags, href: "/categories" },
  { label: "រូបិយបណ្ណ", icon: Globe, href: "/currencies" },
];

export default function QuickMenu() {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-lg font-bold mb-4 font-google-sans text-[#003377] dark:text-white">
        Quick Module
      </h3>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-[#FFC83D]/20 transition-colors">
                <item.icon
                  size={20}
                  className="text-slate-600 dark:text-slate-400 group-hover:text-[#003377]"
                />
              </div>
              <span className="text-sm font-google-sans text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
