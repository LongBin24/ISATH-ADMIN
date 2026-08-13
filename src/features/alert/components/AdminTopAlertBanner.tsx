"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, BellRing, X, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useGetAlertRulesQuery } from "@/features/alert/hooks";

export function AdminTopAlertBanner() {
  const [dismissedRuleIds, setDismissedRuleIds] = useState<string[]>([]);
  const { data: alertRules = [] } = useGetAlertRulesQuery(undefined, {
    pollingInterval: 15000, // Poll every 15 seconds for real-time alert updates
  });

  // Find the highest priority active alert rule that hasn't been dismissed
  const activeAlert = useMemo(() => {
    if (!alertRules || alertRules.length === 0) return null;

    const undismissed = alertRules.filter(
      (rule) => rule.enabled && !dismissedRuleIds.includes(rule.id)
    );

    if (undismissed.length === 0) return null;

    // Sort by severity priority: CRITICAL > WARNING > INFO
    const critical = undismissed.find((r) => r.severity === "CRITICAL");
    if (critical) return critical;

    const warning = undismissed.find((r) => r.severity === "WARNING");
    if (warning) return warning;

    return undismissed[0];
  }, [alertRules, dismissedRuleIds]);

  if (!activeAlert) return null;

  const handleDismiss = () => {
    if (activeAlert) {
      setDismissedRuleIds((prev) => [...prev, activeAlert.id]);
    }
  };

  const isCritical = activeAlert.severity === "CRITICAL";
  const isWarning = activeAlert.severity === "WARNING";

  return (
    <div
      className={`relative w-full border-b px-4 py-2.5 transition-all duration-300 font-google-sans z-30 ${
        isCritical
          ? "bg-red-600 text-white border-red-700 shadow-md dark:bg-red-950 dark:border-red-800"
          : isWarning
            ? "bg-amber-500 text-slate-900 border-amber-600 shadow-sm dark:bg-amber-600 dark:text-slate-950"
            : "bg-[#003377] text-white border-blue-900 shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex shrink-0 items-center justify-center rounded-full bg-white/20 p-1.5">
            {isCritical ? (
              <ShieldAlert className="h-4 w-4 text-white animate-bounce" />
            ) : isWarning ? (
              <AlertTriangle className="h-4 w-4 text-slate-900" />
            ) : (
              <BellRing className="h-4 w-4 text-white" />
            )}
          </div>

          <div className="truncate">
            <span className="font-bold mr-2">
              [{activeAlert.severity}] {activeAlert.ruleName}:
            </span>
            <span className="opacity-95">
              {activeAlert.ruleConfiguration?.message ||
                "មានទិន្នន័យការជូនដំណឹងថ្មីសម្រាប់អ្នកគ្រប់គ្រង (New alert data available for admin)"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/alert"
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-bold transition hover:opacity-90 ${
              isCritical
                ? "bg-white text-red-700 hover:bg-red-50"
                : isWarning
                  ? "bg-slate-900 text-amber-300 hover:bg-slate-800"
                  : "bg-[#FFC83D] text-[#003377] hover:bg-amber-300"
            }`}
          >
            <span>មើលការជូនដំណឹង</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-md p-1 hover:bg-black/10 transition opacity-80 hover:opacity-100"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
