import {
  BellRing,
  CalendarClock,
  ChartNoAxesCombined,
  PiggyBank,
  Repeat2,
  TriangleAlert,
  WalletCards,
} from "lucide-react";
import type { AdminNotificationType, AdminReferenceType } from "./types";

export const NOTIFICATION_TYPE_UI: Record<
  AdminNotificationType,
  { label: string; icon: typeof BellRing; badgeClassName: string }
> = {
  DAILY_REMINDER: {
    label: "Daily Reminder",
    icon: CalendarClock,
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  },
  BUDGET_WARNING: {
    label: "Budget Warning",
    icon: TriangleAlert,
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  },
  SAVINGS_REMINDER: {
    label: "Savings Reminder",
    icon: PiggyBank,
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  },
  RECURRING_REMINDER: {
    label: "Recurring Reminder",
    icon: Repeat2,
    badgeClassName: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  },
  MONTHLY_SUMMARY: {
    label: "Monthly Summary",
    icon: ChartNoAxesCombined,
    badgeClassName: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

export const REFERENCE_TYPE_UI: Record<AdminReferenceType, { label: string; icon: typeof WalletCards }> = {
  BUDGET: { label: "Budget", icon: WalletCards },
  SAVINGS_GOAL: { label: "Savings Goal", icon: PiggyBank },
  RECURRING_TRANSACTION: { label: "Recurring Transaction", icon: Repeat2 },
  WALLET: { label: "Wallet", icon: WalletCards },
  WALLET_INVITATION: { label: "Wallet Invitation", icon: BellRing },
  TRANSACTION: { label: "Transaction", icon: ChartNoAxesCombined },
};

export function notificationTypeLabel(type: AdminNotificationType) {
  return NOTIFICATION_TYPE_UI[type]?.label ?? type;
}

export function referenceTypeLabel(type?: AdminReferenceType) {
  return type ? REFERENCE_TYPE_UI[type]?.label ?? type : "N/A";
}
