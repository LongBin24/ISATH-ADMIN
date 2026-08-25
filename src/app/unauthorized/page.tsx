
"use client";

import Link from "next/link";
import { useOptionalAdminI18n } from "@/i18n/admin-i18n";

export default function UnauthorizedPage() {
  const i18n = useOptionalAdminI18n();
  const t = i18n?.t ?? ((s: string) => s);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1528] px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mb-4 text-5xl">🔒</div>

        <h1 className="mb-3 text-2xl font-bold text-white">
          {t("Access Denied")}
        </h1>

        <p className="mb-6 text-slate-400">
          {t("You do not have permission to access this Admin Dashboard.")}
        </p>

        <Link
          href="/login"
          className="inline-flex rounded-lg bg-[#FFC83D] px-6 py-3 font-semibold text-[#003377] transition hover:opacity-90"
        >
          {t("Back to Login")}
        </Link>
      </div>
    </main>
  );
}
