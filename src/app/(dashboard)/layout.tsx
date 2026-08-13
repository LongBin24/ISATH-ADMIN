"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import { AdminI18nProvider } from "@/i18n/admin-i18n";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((current) => !current);
    } else {
      setSidebarOpen((current) => !current);
    }
  }

  return (
    <AdminI18nProvider><div className="min-h-screen bg-[#F8F9FA] text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 font-google-sans pb-16 lg:pb-0">
      <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} />

      <div className={`flex min-h-screen flex-col transition-[margin] duration-300 ${sidebarCollapsed ? "lg:ml-0" : "lg:ml-[260px]"}`}>
        <Navbar
          onMenuToggle={toggleSidebar}
          isSidebarOpen={sidebarOpen}
          isSidebarCollapsed={sidebarCollapsed}
        />

        <main className="admin-readable flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <MobileBottomNav />
      <PWAInstallPrompt />
    </div></AdminI18nProvider>
  );
}
