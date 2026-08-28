"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import { AdminI18nProvider } from "@/i18n/admin-i18n";

function checkAdminRole(): boolean {
  if (typeof window === "undefined") return true;
  const token =
    window.localStorage.getItem("accessToken") ||
    window.localStorage.getItem("token") ||
    window.sessionStorage.getItem("accessToken") ||
    window.sessionStorage.getItem("token");

  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(window.atob(base64));
    const realmRoles = (decoded.realm_access?.roles || []).map((r: unknown) => String(r).toUpperCase());
    const clientRoles = Object.values(
      (decoded.resource_access || {}) as Record<string, { roles?: unknown[] }>
    )
      .flatMap((r) => r?.roles || [])
      .map((r: unknown) => String(r).toUpperCase());
    const allRoles = [...realmRoles, ...clientRoles];
    return (
      allRoles.includes("ADMIN") ||
      allRoles.includes("ADMINISTRATOR") ||
      allRoles.includes("SUPER_ADMIN") ||
      allRoles.includes("MANAGE-USERS")
    );
  } catch {
    return true;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!checkAdminRole()) {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("idToken");
      window.sessionStorage.removeItem("accessToken");
      window.sessionStorage.removeItem("token");
      document.cookie = "accessToken=; Max-Age=0; path=/";
      router.replace("/login?authError=unauthorized&status=403");
    }
  }, [router]);

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarCollapsed((current) => !current);
    } else {
      setSidebarOpen((current) => !current);
    }
  }

  return (
    <AdminI18nProvider>
      <div className="min-h-screen bg-background text-foreground font-google-sans pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} />

        <div className={`flex min-h-screen flex-col transition-[margin] duration-300 ${sidebarCollapsed ? "lg:ml-0" : "lg:ml-[260px]"}`}>
          <Navbar
            onMenuToggle={toggleSidebar}
            isSidebarOpen={sidebarOpen}
            isSidebarCollapsed={sidebarCollapsed}
          />

          <main className="admin-readable flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8">{children}</main>
        </div>

        <MobileBottomNav />
        <PWAInstallPrompt />
      </div>
    </AdminI18nProvider>
  );
}
