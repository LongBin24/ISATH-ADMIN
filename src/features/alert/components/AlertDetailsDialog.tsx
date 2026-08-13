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

const valueTranslations: Record<string, string> = {
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

function translateValue(value?: string | null) {
  if (!value) return null;
  return valueTranslations[value] ?? value.replaceAll("_", " ");
}

function formatDate(value?: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("km-KH", {
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
    <div className="grid gap-3 py-1 sm:grid-cols-2" aria-label="កំពុងទាញយកព័ត៌មាន">
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
      ? "ធ្ងន់ធ្ងរ"
      : severity === "WARNING"
        ? "ប្រុងប្រយ័ត្ន"
        : "ព័ត៌មាន";

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
                ព័ត៌មានលម្អិតនៃច្បាប់ជូនដំណឹង
              </DialogTitle>
              <DialogDescription className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                {alertRule?.ruleName
                  ? `ព័ត៌មានសម្រាប់៖ ${alertRule.ruleName}`
                  : "ព័ត៌មានសង្ខេបនៃច្បាប់ជូនដំណឹង"}
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
                មិនអាចទាញយកព័ត៌មានបានទេ
              </h3>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                សូមពិនិត្យការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។
              </p>
              <Button
                type="button"
                onClick={refetch}
                className="mt-5 gap-2 rounded-xl bg-[#FFC83D] px-5 font-bold text-[#003377] hover:bg-[#eab52f]"
              >
                <RefreshCw className="size-4" />
                ព្យាយាមម្តងទៀត
              </Button>
            </div>
          ) : alertRule ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl bg-[#003377] p-4 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/65">ឈ្មោះច្បាប់</p>
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
                  label="ប្រភេទការជូនដំណឹង"
                  value={translateValue(alertRule.alertType)}
                />
                <DetailCard
                  icon={TimerReset}
                  label="ប្រភេទលក្ខខណ្ឌ"
                  value={translateValue(alertRule.triggerType)}
                />
                <DetailCard
                  icon={CheckCircle2}
                  label="ស្ថានភាព"
                  value={
                    <span className={alertRule.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}>
                      {alertRule.enabled ? "បានបើកដំណើរការ" : "បានបិទដំណើរការ"}
                    </span>
                  }
                />
                <DetailCard
                  icon={Tag}
                  label="ប្រភេទយោង"
                  value={translateValue(alertRule.referenceType)}
                />
                <DetailCard
                  icon={CalendarDays}
                  label="ចំនួនថ្ងៃជូនដំណឹងមុន"
                  value={alertRule.daysBefore !== null ? `${alertRule.daysBefore} ថ្ងៃ` : null}
                />
                <DetailCard
                  icon={Clock3}
                  label="ម៉ោងរំលឹក"
                  value={alertRule.reminderTime}
                />
                <DetailCard
                  icon={MessageSquareText}
                  label="សារជូនដំណឹង"
                  value={alertRule.ruleConfiguration?.message}
                  className="sm:col-span-2"
                />
              </div>

              <div className="grid gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:grid-cols-2">
                <div>
                  <span className="font-semibold">បានបង្កើត៖</span>{" "}
                  {formatDate(alertRule.createdAt)}
                </div>
                <div className="sm:text-right">
                  <span className="font-semibold">បានកែប្រែចុងក្រោយ៖</span>{" "}
                  {formatDate(alertRule.updatedAt)}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              ពុំមានព័ត៌មានលម្អិតនៃច្បាប់ជូនដំណឹងទេ។
            </div>
          )}
        </div>

        <DialogClose className="m-0 bg-slate-50 px-5 py-4 dark:bg-slate-900 sm:px-7">
          <Button
            type="button"
            onClick={onClose}
            className="min-w-28 rounded-xl bg-[#FFC83D] font-bold text-[#003377] shadow-sm hover:bg-[#eab52f]"
          >
            បិទ
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
