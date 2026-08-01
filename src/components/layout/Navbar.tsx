import { Search, Moon, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-[108px] w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="ស្វែងរក..." className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#FFC83D]" />
      </div>
      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-[#003377]"><Moon size={22} /></button>
        <button className="text-slate-500 hover:text-[#003377] relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">2</span>
        </button>
        <div className="flex items-center gap-3 border-l pl-6 border-slate-200 dark:border-slate-800">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Admin User</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#003377]"><User size={24} /></div>
        </div>
      </div>
    </header>
  );
}