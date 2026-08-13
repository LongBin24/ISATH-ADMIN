"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useGetAlertRulesQuery } from "../hooks";
import { AlertDetailsDialog } from "./AlertDetailsDialog";

const severityLabels = {
  CRITICAL: "ធ្ងន់ធ្ងរ",
  WARNING: "ប្រុងប្រយ័ត្ន",
  INFO: "ព័ត៌មាន",
};

export default function AlertBellDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: alertRules = [] } = useGetAlertRulesQuery(undefined, {
    pollingInterval: 15000,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeAlerts = alertRules.filter((rule) => rule.enabled);
  const criticalCount = activeAlerts.filter((rule) => rule.severity === "CRITICAL").length;
  const recentAlerts = activeAlerts.slice(0, 5);

  const selectRule = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    setIsOpen(false);
  };

  return (
    <div className="relative font-google-sans" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#FFC83D] hover:text-[#8A6500] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
        aria-label="ការជូនដំណឹងរបស់ប្រព័ន្ធ"
        title="ការជូនដំណឹងរបស់ប្រព័ន្ធ"
        aria-expanded={isOpen}
      >
        <AlertTriangle size={20} />
        {activeAlerts.length > 0 && (
          <span
            className={`absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 ${
              criticalCount > 0 ? "animate-pulse bg-red-500" : "bg-[#E3A900]"
            }`}
          >
            {activeAlerts.length > 9 ? "9+" : activeAlerts.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-[#FFF8E1] to-white px-5 py-4 dark:border-slate-800 dark:from-[#FFC83D]/10 dark:to-slate-900">
            <div>
              <p className="text-sm font-bold text-[#003377] dark:text-[#FFC83D]">ការជូនដំណឹងរបស់ប្រព័ន្ធ</p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">ព័ត៌មានសម្រាប់អ្នកគ្រប់គ្រង</p>
            </div>
            {activeAlerts.length > 0 && (
              <span className="rounded-full bg-[#FFC83D]/25 px-2.5 py-1 text-[11px] font-bold text-[#7A5800] dark:text-[#FFC83D]">
                {activeAlerts.length} សកម្ម
              </span>
            )}
          </div>

          <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {recentAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">មិនមានការជូនដំណឹងសកម្មទេ</div>
            ) : (
              recentAlerts.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => selectRule(item.id)}
                  className="group flex w-full items-start gap-3 p-4 text-left transition hover:bg-[#FFC83D]/[0.07] dark:hover:bg-slate-800/60"
                >
                  <span className="mt-0.5 shrink-0">
                    {item.severity === "CRITICAL" ? (
                      <ShieldAlert className="size-4 text-red-500" />
                    ) : item.severity === "WARNING" ? (
                      <AlertTriangle className="size-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="size-4 text-sky-500" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs font-bold text-slate-900 dark:text-white">{item.ruleName}</span>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {severityLabels[item.severity]}
                      </span>
                    </span>
                    <span className="line-clamp-2 block text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      {item.ruleConfiguration?.message || "ច្បាប់ជូនដំណឹងរបស់ប្រព័ន្ធ"}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 self-center text-slate-400 transition group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50/70 p-3 text-center dark:border-slate-800 dark:bg-slate-900">
            <Link
              href="/alert"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[#003377] transition hover:bg-[#FFC83D] dark:text-[#FFC83D] dark:hover:text-[#003377]"
            >
              គ្រប់គ្រងការជូនដំណឹងទាំងអស់
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      )}

      <AlertDetailsDialog
        isOpen={selectedRuleId !== null}
        onClose={() => setSelectedRuleId(null)}
        ruleId={selectedRuleId}
      />
    </div>
  );
}
