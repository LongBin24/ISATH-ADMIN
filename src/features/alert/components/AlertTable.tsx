import { AlertRule } from "../types";
import { BellOff, ChevronRight, Eye, Inbox, LockKeyhole } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface AlertTableProps {
  alertRules: AlertRule[];
  onViewDetails: (ruleId: string) => void;
}

const valueTranslations: Record<string, string> = {
  DAILY_EXPENSE_REMINDER: "រំលឹកចំណាយប្រចាំថ្ងៃ",
  BUDGET_THRESHOLD: "កម្រិតថវិកា",
  SAVINGS_REMINDER: "រំលឹកការសន្សំ",
  RECURRING_REMINDER: "រំលឹកប្រតិបត្តិការប្រចាំ",
  MONTHLY_SUMMARY: "សង្ខេបប្រចាំខែ",
  THRESHOLD_EXCEEDED: "លើសកម្រិតកំណត់",
  CUSTOM: "កំណត់ដោយផ្ទាល់",
  TIME: "តាមម៉ោង",
  THRESHOLD: "តាមកម្រិត",
  EVENT: "តាមព្រឹត្តិការណ៍",
  SCHEDULE: "តាមកាលវិភាគ",
  MANUAL: "ដោយផ្ទាល់",
};

function translateValue(value: string) {
  return valueTranslations[value] ?? value.replaceAll("_", " ");
}

function SeverityBadge({ severity }: { severity: AlertRule["severity"] }) {
  const styles = {
    CRITICAL: "bg-red-50 text-red-700 ring-red-600/15 dark:bg-red-950/50 dark:text-red-300",
    WARNING: "bg-[#FFC83D]/20 text-[#7A5800] ring-[#FFC83D]/40 dark:text-[#FFC83D]",
    INFO: "bg-sky-50 text-sky-700 ring-sky-600/15 dark:bg-sky-950/50 dark:text-sky-300",
  };
  const labels = { CRITICAL: "ធ្ងន់ធ្ងរ", WARNING: "ប្រុងប្រយ័ត្ន", INFO: "ព័ត៌មាន" };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${styles[severity]}`}>
      {labels[severity]}
    </span>
  );
}

function StatusBadge({ rule }: { rule: AlertRule }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${rule.enabled ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" : "bg-slate-400"}`} />
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {rule.enabled ? "ដំណើរការ" : "បានបិទ"}
      </span>
      {!rule.canDisable && <LockKeyhole className="size-3.5 text-slate-400" aria-label="មិនអាចបិទបាន" />}
    </div>
  );
}

export function AlertTable({ alertRules, onViewDetails }: AlertTableProps) {
  if (alertRules.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-[#FFC83D]/20 text-[#8A6500] dark:text-[#FFC83D]">
          <Inbox className="size-7" />
        </span>
        <h3 className="font-bold text-slate-900 dark:text-white">រកមិនឃើញច្បាប់ជូនដំណឹង</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          សូមសាកល្បងកែប្រែពាក្យស្វែងរក ឬជ្រើសរើសតម្រងផ្សេងទៀត។
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="hidden overflow-x-auto md:block">
        <Table className="font-google-sans">
          <TableHeader className="bg-slate-50/80 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent">
              <TableHead>ឈ្មោះច្បាប់</TableHead>
              <TableHead>ប្រភេទជូនដំណឹង</TableHead>
              <TableHead>លក្ខខណ្ឌ</TableHead>
              <TableHead>កម្រិត</TableHead>
              <TableHead>ស្ថានភាព</TableHead>
              <TableHead className="text-right">សកម្មភាព</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertRules.map((rule) => (
              <TableRow key={rule.id} className="group hover:bg-[#FFC83D]/[0.06]">
                <TableCell className="max-w-60">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{rule.ruleName}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">ID: {rule.id}</p>
                </TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">{translateValue(rule.alertType)}</TableCell>
                <TableCell className="text-sm text-slate-600 dark:text-slate-300">{translateValue(rule.triggerType)}</TableCell>
                <TableCell><SeverityBadge severity={rule.severity} /></TableCell>
                <TableCell><StatusBadge rule={rule} /></TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(rule.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#003377] transition hover:border-[#FFC83D] hover:bg-[#FFC83D] dark:border-slate-700 dark:bg-slate-800 dark:text-[#FFC83D] dark:hover:text-[#003377]"
                  >
                    <Eye className="size-4" />
                    មើលលម្អិត
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 md:hidden">
        {alertRules.map((rule) => (
          <button
            type="button"
            key={rule.id}
            onClick={() => onViewDetails(rule.id)}
            className="w-full p-4 text-left transition hover:bg-[#FFC83D]/[0.06]"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#FFC83D]/20 text-[#8A6500] dark:text-[#FFC83D]">
                {rule.enabled ? <Eye className="size-4" /> : <BellOff className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{rule.ruleName}</p>
                  <ChevronRight className="size-4 shrink-0 text-slate-400" />
                </div>
                <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{translateValue(rule.alertType)}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <SeverityBadge severity={rule.severity} />
                  <StatusBadge rule={rule} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
