"use client";

import React, { useState } from "react";
import "@fontsource/google-sans/400.css";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-google-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <Navbar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}