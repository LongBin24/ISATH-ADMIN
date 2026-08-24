"use client";

import { Mail, UserCheck, UserX, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { ContactMessage } from "../types";

interface ContactUsStatsProps {
  messages: ContactMessage[];
  totalElements: number;
  isLoading: boolean;
}

export function ContactUsStats({
  messages,
  totalElements,
  isLoading,
}: ContactUsStatsProps) {
  const { t } = useAdminI18n();

  const registeredCount = messages.filter((m) => m.registeredUser).length;
  const guestCount = messages.filter((m) => !m.registeredUser).length;

  const todayCount = messages.filter((m) => {
    try {
      const msgDate = new Date(m.createdAt);
      const today = new Date();
      return (
        msgDate.getDate() === today.getDate() &&
        msgDate.getMonth() === today.getMonth() &&
        msgDate.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  }).length;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-google-sans">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-google-sans">
      <StatCard
        icon={Mail}
        label={t("Total Messages")}
        value={totalElements}
        helper={t("All customer inquiries")}
        iconBg="bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/15 dark:text-[#FFC83D]"
      />
      <StatCard
        icon={UserCheck}
        label={t("Registered Users")}
        value={registeredCount}
        helper={t("From logged-in accounts")}
        iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
      />
      <StatCard
        icon={UserX}
        label={t("Guest Inquiries")}
        value={guestCount}
        helper={t("From public contact form")}
        iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
      />
      <StatCard
        icon={Clock}
        label={t("Today's Messages")}
        value={todayCount}
        helper={t("Received today")}
        iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
      />
    </section>
  );
}

interface StatCardProps {
  icon: typeof Mail;
  label: string;
  value: number | string;
  helper: string;
  iconBg: string;
}

function StatCard({ icon: Icon, label, value, helper, iconBg }: StatCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <CardContent className="flex items-center gap-4 p-5 sm:p-6">
        <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${iconBg}`}>
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-[#003377] dark:text-white sm:text-3xl">
            {value}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
