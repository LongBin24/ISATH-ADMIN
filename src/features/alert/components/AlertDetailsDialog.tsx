"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  RefreshCw,
  ShieldAlert,
  Tag,
  TimerReset,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAlertRuleByIdQuery } from "@/features/alert/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/hooks/use-i18n";

interface AlertDetailsDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  ruleId?: string | null;
}

interface DetailCardProps {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
  className?: string;
}

const valueTranslationsKh: Record<string, string> = {
  DAILY_EXPENSE_REMINDER: "រំលឹកការចំណាយប្រចាំថ្ងៃ",
  BUDGET_THRESHOLD: "កម្រិតថវិកា",
  SAVINGS_REMINDER: "រំលឹកការសន្សំ",
  RECURRING_REMINDER: "រំលឹកប្រតិបត្តិការប្រចាំ",
  MONTHLY_SUMMARY: "សេចក្តីសង្ខេបប្រចាំខែ",
  THRESHOLD_EXCEEDED: "លើសកម្រិតកំណត់",
  CUSTOM: "កំណត់ដោយផ្ទាល់",
  TIME: "តាមម៉ោង",
  THRESHOLD: "តាមកម្រិតកំណត់",
  EVENT: "តាមព្រឹត្តិការណ៍",
  SCHEDULE: "តាមកាលវិភាគ",
  MANUAL: "ដោយផ្ទាល់",
  BUDGET: "ថវិកា",
  SAVINGS_GOAL: "គោលដៅសន្សំ",
  RECURRING_TRANSACTION: "ប្រតិបត្តិការប្រចាំ",
  TRANSACTION_CATEGORY: "ប្រភេទប្រតិបត្តិការ",
  ACCOUNT_BALANCE: "សមតុល្យគណនី",
  NONE: "គ្មាន",
};

const valueTranslationsEn: Record<string, string> = {
  DAILY_EXPENSE_REMINDER: "Daily Expense Reminder",
  BUDGET_THRESHOLD: "Budget Threshold",
  SAVINGS_REMINDER: "Savings Reminder",
  RECURRING_REMINDER: "Recurring Reminder",
  MONTHLY_SUMMARY: "Monthly Summary",
  THRESHOLD_EXCEEDED: "Threshold Exceeded",
  CUSTOM: "Custom",
  TIME: "By Time",
  THRESHOLD: "By Threshold",
  EVENT: "By Event",
  SCHEDULE: "By Schedule",
  MANUAL: "Manual",
  BUDGET: "Budget",
  SAVINGS_GOAL: "Savings Goal",
  RECURRING_TRANSACTION: "Recurring Transaction",
  TRANSACTION_CATEGORY: "Transaction Category",
  ACCOUNT_BALANCE: "Account Balance",
  NONE: "None",
};

function translateValue(value: string | null | undefined, isEnglish: boolean) {
  if (!value) return null;
  const map = isEnglish ? valueTranslationsEn : valueTranslationsKh;
  return map[value] ?? value.replaceAll("_", " ");
}

function formatDate(value: string | null | undefined, isEnglish: boolean) {
  if (!value) return null;

  return new Intl.DateTimeFormat(isEnglish ? "en-US" : "km-KH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailCard({ icon: Icon, label, value, className = "" }: DetailCardProps) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-colors dark:border-slate-700 dark:bg-slate-800/60 ${className}`}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="grid size-7 place-items-center rounded-lg bg-[#FFC83D]/20 text-[#8A6500] dark:text-[#FFC83D]">
          <Icon className="size-3.5" />
        </span>
        {label}
      </div>
      <div className="break-words pl-9 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3 py-1 sm:grid-cols-2" aria-label="Loading details">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function AlertDetailsDialog({
  isOpen = false,
  onClose,
  ruleId,
}: AlertDetailsDialogProps) {
  const { dict, isEnglish } = useI18n();
  const {
    data: alertRule,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAlertRuleByIdQuery(ruleId ?? "", {
    skip: !isOpen || !ruleId,
    refetchOnMountOrArgChange: true,
  });

  const severity = alertRule?.severity;
  const severityLabel =
    severity === "CRITICAL"
      ? dict.alerts.criticalRules
      : severity === "WARNING"
        ? dict.alerts.warningRules
        : dict.alerts.infoRules;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onClose={onClose}
        className="max-h-[90vh] overflow-hidden rounded-3xl border-0 p-0 font-google-sans sm:max-w-[700px]"
      >
        <DialogHeader className="relative mb-0 border-b border-[#FFC83D]/40 bg-gradient-to-br from-[#FFF8E1] via-white to-[#FFC83D]/20 px-6 py-5 pr-14 text-left dark:border-[#FFC83D]/20 dark:from-slate-900 dark:via-slate-900 dark:to-[#FFC83D]/10 sm:px-7 sm:py-6">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#FFC83D] text-[#003377] shadow-[0_8px_20px_-10px_rgba(255,200,61,0.9)]">
              <BellRing className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-bold text-[#003377] dark:text-[#FFC83D] sm:text-xl">
                {dict.alerts.dialogTitle}
              </DialogTitle>
              <DialogDescription className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {alertRule?.ruleName
                  ? dict.alerts.dialogSubtitle.replace("{name}", alertRule.ruleName)
                  : dict.alerts.dialogDefaultSubtitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[calc(90vh-190px)] overflow-y-auto px-5 py-5 sm:px-7">
          {isLoading || isFetching ? (
            <LoadingState />
          ) : isError ? (
            <div className="flex flex-col items-center rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900/60 dark:bg-red-950/30">
              <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
                <AlertCircle className="size-6" />
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {dict.alerts.errorDialogLoading}
              </h3>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                {dict.alerts.errorDialogDesc}
              </p>
              <Button
                type="button"
                onClick={refetch}
                className="mt-5 gap-2 rounded-xl bg-[#FFC83D] px-5 font-bold text-[#003377] hover:bg-[#eab52f]"
              >
                <RefreshCw className="size-4" />
                {dict.alerts.tryAgain}
              </Button>
            </div>
          ) : alertRule ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl bg-[#003377] p-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/65">{dict.alerts.ruleName}</p>
                  <p className="mt-1 truncate font-bold">{alertRule.ruleName}</p>
                </div>
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                    severity === "CRITICAL"
                      ? "bg-red-500 text-white"
                      : severity === "WARNING"
                        ? "bg-[#FFC83D] text-[#003377]"
                        : "bg-sky-400 text-[#003377]"
                  }`}
                >
                  <ShieldAlert className="size-3.5" />
                  {severityLabel}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailCard
                  icon={BellRing}
                  label={dict.alerts.alertTypeLabel}
                  value={translateValue(alertRule.alertType, isEnglish)}
                />
                <DetailCard
                  icon={TimerReset}
                  label={dict.alerts.triggerTypeLabel}
                  value={translateValue(alertRule.triggerType, isEnglish)}
                />
                <DetailCard
                  icon={CheckCircle2}
                  label={dict.alerts.statusLabel}
                  value={
                    <span className={alertRule.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}>
                      {alertRule.enabled ? dict.alerts.enabled : dict.alerts.disabled}
                    </span>
                  }
                />
                <DetailCard
                  icon={Tag}
                  label={dict.alerts.referenceTypeLabel}
                  value={translateValue(alertRule.referenceType, isEnglish)}
                />
                <DetailCard
                  icon={CalendarDays}
                  label={dict.alerts.daysBeforeLabel}
                  value={alertRule.daysBefore !== null ? `${alertRule.daysBefore} ${dict.alerts.daysUnit}` : null}
                />
                <DetailCard
                  icon={Clock3}
                  label={dict.alerts.reminderTimeLabel}
                  value={alertRule.reminderTime}
                />
                <DetailCard
                  icon={MessageSquareText}
                  label={dict.alerts.alertMessageLabel}
                  value={alertRule.ruleConfiguration?.message}
                  className="sm:col-span-2"
                />
              </div>

              <div className="grid gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">{dict.alerts.createdAtLabel}</span>{" "}
                  {formatDate(alertRule.createdAt, isEnglish)}
                </div>
                <div className="sm:text-right">
                  <span className="font-semibold">{dict.alerts.updatedAtLabel}</span>{" "}
                  {formatDate(alertRule.updatedAt, isEnglish)}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              {dict.alerts.noDetails}
            </div>
          )}
        </div>

        <DialogClose className="m-0 bg-slate-50 px-5 py-4 dark:bg-slate-900 sm:px-7">
          <Button
            type="button"
            onClick={onClose}
            className="min-w-28 rounded-xl bg-[#FFC83D] font-bold text-[#003377] shadow-sm hover:bg-[#eab52f]"
          >
            {dict.common.close}
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
