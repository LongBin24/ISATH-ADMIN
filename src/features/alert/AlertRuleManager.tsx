"use client";

import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  BellRing,
  CalendarClock,
  Check,
  ChevronsUpDown,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock3,
  Eye,
  Gauge,
  LockKeyhole,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldAlert,
  Tag,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAdminUsersQuery } from "@/features/user-manager/api";
import type { AdminUser } from "@/features/user-manager/types";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";
import { useGetAdminAlertRulesQuery, useGetAlertRuleByIdQuery } from "./api";
import type {
  AlertRule,
  AlertRuleQueryParams,
  AlertType,
  ReferenceType,
  Severity,
  TriggerType,
} from "./types";

type FilterValue<T extends string> = "ALL" | T;
type EnabledFilter = "ALL" | "ENABLED" | "DISABLED";

const ALERT_LABELS: Record<AlertType, string> = {
  DAILY_EXPENSE_REMINDER: "Daily Expense Reminder",
  BUDGET_THRESHOLD: "Budget Threshold",
  SAVINGS_REMINDER: "Savings Reminder",
  RECURRING_REMINDER: "Recurring Reminder",
  MONTHLY_SUMMARY: "Monthly Summary",
};
const TRIGGER_LABELS: Record<TriggerType, string> = {
  TIME: "Time",
  THRESHOLD: "Threshold",
  EVENT: "Event",
  SCHEDULE: "Schedule",
};
const REFERENCE_LABELS: Record<ReferenceType, string> = {
  BUDGET: "Budget",
  SAVINGS_GOAL: "Savings Goal",
  RECURRING_TRANSACTION: "Recurring Transaction",
};

function userName(user?: AdminUser) {
  return (
    user?.displayName ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    user?.username ||
    "User"
  );
}
function initials(user?: AdminUser) {
  return (
    userName(user)
      .split(/\s+/)
      .map((value) => value[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}
function exactDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "N/A" : format(date, "PPp");
}
function relativeDate(value?: string | null) {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : formatDistanceToNow(date, { addSuffix: true });
}
function friendlyEnum(value?: string | null) {
  return value
    ? value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "N/A";
}

export default function AlertRuleManager() {
  const { t } = useAdminI18n();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState("");
  const [alertType, setAlertType] = useState<FilterValue<AlertType>>("ALL");
  const [triggerType, setTriggerType] =
    useState<FilterValue<TriggerType>>("ALL");
  const [severity, setSeverity] = useState<FilterValue<Severity>>("ALL");
  const [enabled, setEnabled] = useState<EnabledFilter>("ALL");
  const [referenceType, setReferenceType] =
    useState<FilterValue<ReferenceType>>("ALL");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const params = useMemo<AlertRuleQueryParams>(
    () => ({
      ...(userId ? { userId } : {}),
      ...(alertType !== "ALL" ? { alertType } : {}),
      ...(triggerType !== "ALL" ? { triggerType } : {}),
      ...(severity !== "ALL" ? { severity } : {}),
      ...(enabled !== "ALL" ? { enabled: enabled === "ENABLED" } : {}),
      ...(referenceType !== "ALL" ? { referenceType } : {}),
      pageNumber,
      pageSize,
      sortBy: "createdAt",
      sortDirection: "DESC",
    }),
    [
      alertType,
      enabled,
      pageNumber,
      pageSize,
      referenceType,
      severity,
      triggerType,
      userId,
    ],
  );
  const rulesQuery = useGetAdminAlertRulesQuery(params);
  const totalQuery = useGetAdminAlertRulesQuery({ pageNumber: 0, pageSize: 1 });
  const enabledQuery = useGetAdminAlertRulesQuery({
    enabled: true,
    pageNumber: 0,
    pageSize: 1,
  });
  const criticalQuery = useGetAdminAlertRulesQuery({
    severity: "CRITICAL",
    pageNumber: 0,
    pageSize: 1,
  });
  const warningQuery = useGetAdminAlertRulesQuery({
    severity: "WARNING",
    pageNumber: 0,
    pageSize: 1,
  });
  const usersQuery = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 200 });
  const users = useMemo(
    () => usersQuery.data?.content ?? [],
    [usersQuery.data?.content],
  );
  const usersById = useMemo(
    () => new Map(users.map((user) => [user.id, user])),
    [users],
  );
  const rules = rulesQuery.data?.content ?? [];

  const filteredRules = useMemo(() => {
    if (!search.trim()) return rules;
    const term = search.toLowerCase().trim();
    return rules.filter((rule) => {
      const user = usersById.get(rule.userId);
      const name = userName(user).toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const alertTypeStr = rule.alertType.toLowerCase();
      const triggerTypeStr = rule.triggerType.toLowerCase();
      const severityStr = rule.severity.toLowerCase();
      const refTypeStr = (rule.referenceType || "").toLowerCase();
      const idStr = rule.id.toLowerCase();
      return (
        name.includes(term) ||
        email.includes(term) ||
        alertTypeStr.includes(term) ||
        triggerTypeStr.includes(term) ||
        severityStr.includes(term) ||
        refTypeStr.includes(term) ||
        idStr.includes(term)
      );
    });
  }, [rules, search, usersById]);

  const page = rulesQuery.data?.page;
  const totalPages = page?.totalPages ?? 0;
  const totalElements = page?.totalElements ?? 0;
  const safePage = Math.min(pageNumber, Math.max(0, totalPages - 1));
  const hasFilters = Boolean(
    search.trim() ||
    userId ||
    alertType !== "ALL" ||
    triggerType !== "ALL" ||
    severity !== "ALL" ||
    enabled !== "ALL" ||
    referenceType !== "ALL",
  );

  const pageNumbers = useMemo(() => {
    const start = Math.max(0, Math.min(safePage - 2, totalPages - 5));
    return Array.from(
      { length: Math.min(5, totalPages) },
      (_, index) => start + index,
    );
  }, [safePage, totalPages]);

  function resetFilters() {
    setSearch("");
    setUserId("");
    setAlertType("ALL");
    setTriggerType("ALL");
    setSeverity("ALL");
    setEnabled("ALL");
    setReferenceType("ALL");
    setPageNumber(0);
  }
  function openDetails(rule: AlertRule) {
    setSelectedId(rule.id);
    setDetailOpen(true);
  }
  const statsLoading =
    totalQuery.isLoading ||
    enabledQuery.isLoading ||
    criticalQuery.isLoading ||
    warningQuery.isLoading;
  const first = totalElements ? safePage * pageSize + 1 : 0;
  const last = Math.min((safePage + 1) * pageSize, totalElements);

  return (
    <div className="space-y-7 font-google-sans">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-[32px]">
          {t("Alert Rules")}
        </h1>
        <p className="mt-1 max-w-3xl text-[18px] leading-relaxed text-muted-foreground font-normal">
          {t(
            "Monitor user alert rules, trigger conditions, severity, references, and execution schedules.",
          )}
        </p>
      </header>
      <div className="admin-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={BellRing}
              label={t("Total Rules")}
              value={totalQuery.data?.page.totalElements ?? "N/A"}
              helper={t("All alert rules")}
            />
            <StatCard
              icon={CircleCheck}
              label={t("Enabled")}
              value={enabledQuery.data?.page.totalElements ?? "N/A"}
              helper={t("Currently active")}
            />
            <StatCard
              icon={ShieldAlert}
              label={t("Critical")}
              value={criticalQuery.data?.page.totalElements ?? "N/A"}
              helper={t("High-priority rules")}
            />
            <StatCard
              icon={TriangleAlert}
              label={t("Warning")}
              value={warningQuery.data?.page.totalElements ?? "N/A"}
              helper={t("Warning-level rules")}
            />
          </>
        )}
      </div>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {t("Alert Rules")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {t(
              "Read-only monitoring of user notification rules and schedules.",
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={cn(
              "grid gap-2 md:grid-cols-2 xl:items-center",
              hasFilters
                ? "xl:grid-cols-[minmax(0,1.5fr)_repeat(7,minmax(0,1fr))]"
                : "xl:grid-cols-[minmax(0,2fr)_repeat(6,minmax(0,1fr))]",
            )}
          >
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageNumber(0);
                }}
                placeholder={t("Search user, or reference...")}
                className="h-11 rounded-xl bg-background pl-10 pr-9 text-sm shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPageNumber(0);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 xl:contents">
              <UserFilter
                value={userId}
                users={users}
                loading={usersQuery.isLoading}
                onChange={(value) => {
                  setUserId(value);
                  setPageNumber(0);
                }}
              />
              <RuleSelect
                label="Alert Type"
                value={alertType}
                options={{
                  ALL: t("All Alert Types"),
                  DAILY_EXPENSE_REMINDER: t("Daily Expense Reminder"),
                  BUDGET_THRESHOLD: t("Budget Threshold"),
                  SAVINGS_REMINDER: t("Savings Reminder"),
                  RECURRING_REMINDER: t("Recurring Reminder"),
                  MONTHLY_SUMMARY: t("Monthly Summary"),
                }}
                onChange={(value) => {
                  setAlertType(value as FilterValue<AlertType>);
                  setPageNumber(0);
                }}
              />
              <RuleSelect
                label="Trigger"
                value={triggerType}
                options={{
                  ALL: t("All Triggers"),
                  TIME: t("Time"),
                  THRESHOLD: t("Threshold"),
                  EVENT: t("Event"),
                  SCHEDULE: t("Schedule"),
                }}
                onChange={(value) => {
                  setTriggerType(value as FilterValue<TriggerType>);
                  setPageNumber(0);
                }}
              />
              <RuleSelect
                label="Severity"
                value={severity}
                options={{
                  ALL: t("All Severities"),
                  INFO: t("Info"),
                  WARNING: t("Warning"),
                  CRITICAL: t("Critical"),
                }}
                onChange={(value) => {
                  setSeverity(value as FilterValue<Severity>);
                  setPageNumber(0);
                }}
              />
              <RuleSelect
                label="Status"
                value={enabled}
                options={{
                  ALL: t("All Statuses"),
                  ENABLED: t("Enabled"),
                  DISABLED: t("Disabled"),
                }}
                onChange={(value) => {
                  setEnabled(value as EnabledFilter);
                  setPageNumber(0);
                }}
              />
              <RuleSelect
                label="Reference"
                value={referenceType}
                options={{
                  ALL: t("All References"),
                  BUDGET: t("Budget"),
                  SAVINGS_GOAL: t("Savings Goal"),
                  RECURRING_TRANSACTION: t("Recurring Transaction"),
                }}
                onChange={(value) => {
                  setReferenceType(value as FilterValue<ReferenceType>);
                  setPageNumber(0);
                }}
              />
              {hasFilters && (
                <Button
                  variant="ghost"
                  className="h-11 w-full shrink-0 rounded-xl bg-muted/60 px-3 text-sm font-medium shadow-sm"
                  onClick={resetFilters}
                >
                  {t("Reset")}
                </Button>
              )}
            </div>
          </div>
          {rulesQuery.isError ? (
            <ErrorState onRetry={() => rulesQuery.refetch()} />
          ) : rulesQuery.isLoading ? (
            <TableSkeleton />
          ) : filteredRules.length === 0 ? (
            <EmptyState filtered={hasFilters} onReset={resetFilters} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-60 text-base font-semibold">
                        {t("Rule")}
                      </TableHead>
                      <TableHead className="min-w-48 text-base font-semibold">
                        {t("User")}
                      </TableHead>
                      <TableHead className="min-w-44 text-base font-semibold">
                        {t("Alert Type")}
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        {t("Trigger")}
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        {t("Severity")}
                      </TableHead>
                      <TableHead className="min-w-32 text-base font-semibold">
                        {t("Status")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Next Trigger")}
                      </TableHead>
                      <TableHead className="w-14 text-right text-base font-semibold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules.map((rule) => (
                      <RuleRow
                        key={rule.id}
                        rule={rule}
                        user={usersById.get(rule.userId)}
                        onView={() => openDetails(rule)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-base sm:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                  <PaginationSummary
                    start={first}
                    end={last}
                    total={totalElements}
                    entityName={t("Alert Rules")}
                  />
                  <div className="admin-page-size">
                    <Select
                      value={String(pageSize)}
                      onValueChange={(val) => {
                        setPageSize(Number(val));
                        setPageNumber(0);
                      }}
                    >
                      <SelectTrigger className="h-9 w-32 text-xs">
                        <SelectValue placeholder={t(`${pageSize} / page`)} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">{t("5 / page")}</SelectItem>
                        <SelectItem value="10">{t("10 / page")}</SelectItem>
                        <SelectItem value="20">{t("20 / page")}</SelectItem>
                        <SelectItem value="50">{t("50 / page")}</SelectItem>
                        <SelectItem value="100">{t("100 / page")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {totalPages > 1 && (
                  <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          disabled={safePage === 0}
                          onClick={() =>
                            setPageNumber((p) => Math.max(0, p - 1))
                          }
                        />
                      </PaginationItem>
                      {pageNumbers.map((num) => (
                        <PaginationItem key={num}>
                          <PaginationLink
                            isActive={num === safePage}
                            onClick={() => setPageNumber(num)}
                          >
                            {num + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          disabled={safePage + 1 >= totalPages}
                          onClick={() =>
                            setPageNumber((p) =>
                              Math.min(totalPages - 1, p + 1),
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <RuleDetailDialog
        ruleId={selectedId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        usersById={usersById}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof BellRing;
  label: string;
  value: React.ReactNode;
  helper: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex gap-4 p-5 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:text-[#FEDB55]">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground font-normal">
            {helper}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RuleSelect({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label?: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  const isSelected = value !== "ALL";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
          compact ? "admin-page-size w-32" : "min-w-0",
          isSelected &&
            "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]",
        )}
      >
        <SelectValue placeholder={label} value={options[value]} />
      </SelectTrigger>
      <SelectContent
        value={value}
        onValueChange={onChange}
        className="rounded-xl"
      >
        {Object.entries(options).map(([key, text]) => (
          <SelectItem key={key} value={key}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function UserFilter({
  value,
  users,
  loading,
  onChange,
}: {
  value: string;
  users: AdminUser[];
  loading: boolean;
  onChange: (value: string) => void;
}) {
  const { t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedUser = useMemo(
    () => users.find((user) => user.id === value),
    [users, value]
  );

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) => {
      const name = userName(user).toLowerCase();
      const email = (user.email || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      return name.includes(q) || email.includes(q) || username.includes(q);
    });
  }, [users, query]);

  const isSelected = Boolean(value && value !== "ALL");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-11 w-full min-w-0 items-center justify-between gap-2.5 rounded-xl border border-input bg-muted/60 px-3 text-left text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
          isSelected &&
            "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
        )}
      >
        <span className="min-w-0 flex-1 truncate">
          {selectedUser ? (
            <span className="flex min-w-0 items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={selectedUser.profileImageUrl ?? undefined}
                  alt={userName(selectedUser)}
                />
                <AvatarFallback className="text-[10px]">
                  {initials(selectedUser)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm font-medium">
                {userName(selectedUser)}
              </span>
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {loading ? t("Loading users...") : t("All Users")}
            </span>
          )}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(24rem,calc(100vw-2rem))] p-2 text-base font-google-sans"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("Search by name, username, or email...")}
            className="h-10 pl-9 pr-8 text-sm"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
          {/* Option for All Users */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-accent transition-colors",
              !isSelected &&
                "bg-accent/60 font-semibold text-[#003377] dark:text-[#FFC83D]"
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground">
                <UserRound className="size-4" />
              </span>
              <span>{t("All Users")}</span>
            </div>
            {!isSelected && <Check className="size-4 text-emerald-600" />}
          </button>

          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))
          ) : filteredUsers.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {t("No users found.")}
            </p>
          ) : (
            filteredUsers.map((user) => {
              const name = userName(user);
              const isCurrent = user.id === value;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onChange(user.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-accent transition-colors",
                    isCurrent && "bg-accent/60"
                  )}
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={user.profileImageUrl ?? undefined}
                      alt={name}
                    />
                    <AvatarFallback className="text-xs">
                      {initials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground font-normal">
                      {user.email}
                    </span>
                  </span>
                  {isCurrent && (
                    <Check className="size-4 shrink-0 text-emerald-600" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UserCell({ user }: { user?: AdminUser }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarImage src={user?.profileImageUrl ?? undefined} />
        <AvatarFallback>{initials(user)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-base font-medium">{userName(user)}</p>
        <p className="truncate text-sm text-muted-foreground font-normal">
          {user?.email || t("User details unavailable")}
        </p>
      </div>
    </div>
  );
}

function AlertTypeBadge({ type }: { type: AlertType }) {
  const { t } = useAdminI18n();
  const classes =
    type === "DAILY_EXPENSE_REMINDER"
      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
      : type === "BUDGET_THRESHOLD"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
        : type === "SAVINGS_REMINDER"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
          : type === "RECURRING_REMINDER"
            ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300"
            : "border-[#FFC83D] bg-[#FFC83D]/15 text-[#003377] dark:text-[#FFC83D]";
  return (
    <Badge variant="outline" className={`text-sm font-semibold ${classes}`}>
      {t(ALERT_LABELS[type] || friendlyEnum(type))}
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useAdminI18n();
  const classes =
    severity === "CRITICAL"
      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
      : severity === "WARNING"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
        : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300";
  return (
    <Badge variant="outline" className={`text-sm ${classes}`}>
      {t(friendlyEnum(severity))}
    </Badge>
  );
}

function EnabledBadge({ rule }: { rule: AlertRule }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={
          rule.enabled
            ? "gap-1 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
            : "gap-1 border-slate-200 bg-slate-100 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        }
      >
        {rule.enabled ? (
          <CircleCheck className="size-3.5" />
        ) : (
          <CircleX className="size-3.5" />
        )}
        {t(rule.enabled ? "Enabled" : "Disabled")}
      </Badge>
      {!rule.canDisable && (
        <Tooltip>
          <TooltipTrigger>
            <LockKeyhole className="size-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{t("User cannot disable this rule")}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function Trigger({ type }: { type: TriggerType }) {
  const { t } = useAdminI18n();
  const Icon =
    type === "TIME"
      ? Clock3
      : type === "THRESHOLD"
        ? Gauge
        : type === "SCHEDULE"
          ? CalendarClock
          : BellRing;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <Icon className="size-3.5 text-muted-foreground" />
      {t(TRIGGER_LABELS[type] || friendlyEnum(type))}
    </span>
  );
}

function RuleRow({
  rule,
  user,
  onView,
}: {
  rule: AlertRule;
  user?: AdminUser;
  onView: () => void;
}) {
  const { t } = useAdminI18n();
  const secondary =
    rule.thresholdPercentage != null
      ? `${rule.thresholdPercentage}% threshold`
      : rule.reminderTime
        ? `Reminder at ${rule.reminderTime}`
        : rule.referenceType
          ? t(REFERENCE_LABELS[rule.referenceType])
          : t(friendlyEnum(rule.triggerType));

  return (
    <TableRow className="cursor-pointer" onClick={onView}>
      <TableCell className="py-4">
        <p className="text-base font-semibold">{rule.ruleName}</p>
        <p className="mt-1 text-sm text-muted-foreground font-normal">
          {secondary}
        </p>
      </TableCell>
      <TableCell className="py-4">
        <UserCell user={user} />
      </TableCell>
      <TableCell className="py-4">
        <AlertTypeBadge type={rule.alertType} />
      </TableCell>
      <TableCell className="py-4">
        <Trigger type={rule.triggerType} />
      </TableCell>
      <TableCell className="py-4">
        <SeverityBadge severity={rule.severity} />
      </TableCell>
      <TableCell className="py-4">
        <EnabledBadge rule={rule} />
      </TableCell>
      <TableCell className="py-4 text-sm text-muted-foreground font-normal">
        {rule.nextTriggerAt ? (
          <Tooltip>
            <TooltipTrigger>{relativeDate(rule.nextTriggerAt)}</TooltipTrigger>
            <TooltipContent>{exactDate(rule.nextTriggerAt)}</TooltipContent>
          </Tooltip>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell
        className="py-4 text-right"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`${rule.ruleName} actions`}
              className="size-8.5 rounded-xl border border-slate-200/80 bg-transparent text-slate-600 shadow-2xs transition hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]"
            >
              <MoreHorizontal className="size-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onView}>
              <Eye className="size-4" />
              {t("View Details")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function RuleDetailDialog({
  ruleId,
  open,
  onOpenChange,
  usersById,
}: {
  ruleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usersById: Map<string, AdminUser>;
}) {
  const { t } = useAdminI18n();
  const query = useGetAlertRuleByIdQuery(ruleId ?? "", {
    skip: !ruleId || !open,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[88vh] max-w-[720px] flex-col overflow-hidden p-0 font-google-sans"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader className="mb-0 shrink-0 border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
              <BellRing className="size-5.5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold text-[#003377] dark:text-[#FFC83D]">
                {t("Alert Rule Details")}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {t("Read-only rule configuration and execution information.")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          {query.isLoading ? (
            <DetailSkeleton />
          ) : query.isError || !query.data ? (
            <ErrorState onRetry={() => query.refetch()} />
          ) : (
            <RuleDetail
              rule={query.data}
              user={usersById.get(query.data.userId)}
            />
          )}
        </div>

        <div className="shrink-0 flex items-center justify-end border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/70">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-slate-200 px-6 text-base font-semibold text-slate-700 transition hover:border-[#003377] hover:text-[#003377] dark:border-slate-700 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RuleDetail({ rule, user }: { rule: AlertRule; user?: AdminUser }) {
  const { t } = useAdminI18n();
  return (
    <div className="space-y-6">
      {/* Rule Name Banner */}
      <section className="rounded-2xl border border-slate-200/90 border-l-4 border-l-[#003377] bg-slate-50/70 p-5 dark:border-slate-800 dark:border-l-[#FFC83D] dark:bg-slate-900/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
              {t("Rule Name")}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {rule.ruleName}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <AlertTypeBadge type={rule.alertType} />
            <SeverityBadge severity={rule.severity} />
            <EnabledBadge rule={rule} />
          </div>
        </div>

        {/* Assigned User */}
        <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950/60">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t("Assigned User")}
          </p>
          <UserCell user={user} />
        </div>
      </section>

      {/* Rule Configuration */}
      <DetailSection icon={Gauge} title={t("Rule Configuration")}>
        <Detail
          label={t("Alert Type")}
          value={
            <span className="font-bold text-[#003377] dark:text-[#FFC83D]">
              {t(ALERT_LABELS[rule.alertType])}
            </span>
          }
        />
        <Detail
          label={t("Trigger Type")}
          value={
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {t(TRIGGER_LABELS[rule.triggerType])}
            </span>
          }
        />
        <Detail
          label={t("Severity")}
          value={<SeverityBadge severity={rule.severity} />}
        />
        {rule.frequency && (
          <Detail
            label={t("Frequency")}
            value={
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {t(friendlyEnum(rule.frequency))}
              </span>
            }
          />
        )}
        {rule.thresholdPercentage != null && (
          <Detail
            label={t("Threshold")}
            value={
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {`${rule.thresholdPercentage}%`}
              </span>
            }
          />
        )}
        {rule.reminderTime && (
          <Detail
            label={t("Reminder Time")}
            value={
              <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {rule.reminderTime}
              </span>
            }
          />
        )}
        {rule.daysBefore != null && (
          <Detail
            label={t("Days Before")}
            value={
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {`${rule.daysBefore} ${rule.daysBefore === 1 ? t("day") : t("days")}`}
              </span>
            }
          />
        )}
      </DetailSection>

      {/* Reference */}
      <DetailSection icon={Tag} title={t("Reference")}>
        <Detail
          label={t("Type")}
          value={
            rule.referenceType ? (
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {t(REFERENCE_LABELS[rule.referenceType])}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {t("No reference")}
              </span>
            )
          }
        />
      </DetailSection>

      {/* Schedule */}
      <DetailSection icon={CalendarClock} title={t("Schedule")}>
        <Detail
          label={t("Next Trigger")}
          value={
            rule.nextTriggerAt ? (
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {exactDate(rule.nextTriggerAt)}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {t("No next trigger scheduled")}
              </span>
            )
          }
        />
        <Detail
          label={t("Last Trigger")}
          value={
            rule.lastTriggeredAt ? (
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {exactDate(rule.lastTriggeredAt)}
              </span>
            ) : (
              <span className="text-slate-400 dark:text-slate-500">
                {t("Never triggered")}
              </span>
            )
          }
        />
      </DetailSection>

      {/* Rule Status */}
      <DetailSection icon={ShieldAlert} title={t("Rule Status")}>
        <Detail
          label={t("Enabled")}
          value={
            rule.enabled ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                <CircleCheck className="size-4" />
                {t("Yes")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-500 dark:text-slate-400">
                <CircleX className="size-4" />
                {t("No")}
              </span>
            )
          }
        />
        <Detail
          label={t("User Can Disable")}
          value={
            <span className="inline-flex items-center gap-1.5 font-medium">
              {rule.canDisable ? (
                <span className="text-emerald-600 dark:text-emerald-400">{t("Yes")}</span>
              ) : (
                <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                  {t("No")}
                  <LockKeyhole className="size-3.5 text-amber-500" />
                </span>
              )}
            </span>
          }
        />
      </DetailSection>

      {/* Timeline */}
      <DetailSection icon={Clock3} title={t("Timeline")}>
        <Detail
          label={t("Created")}
          value={
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {exactDate(rule.createdAt)}
            </span>
          }
        />
        <Detail
          label={t("Updated")}
          value={
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {exactDate(rule.updatedAt)}
            </span>
          }
        />
      </DetailSection>
    </div>
  );
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#003377] dark:text-[#FFC83D]">
        {Icon && <Icon className="size-4 text-[#003377] dark:text-[#FFC83D]" />}
        {title}
      </h3>
      <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 px-4 divide-y divide-slate-200/70 dark:border-slate-800 dark:bg-slate-900/40 dark:divide-slate-800/80">
        {children}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="text-right text-base font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-2xl border p-4">
      <Skeleton className="mb-4 h-11 w-full" />
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="mb-3 h-16 w-full" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-14 text-center">
      <CircleAlert className="size-8 text-destructive" />
      <p className="text-lg font-semibold">
        {t("Unable to load alert rules.")}
      </p>
      <p className="text-sm text-muted-foreground font-normal">
        {t("Please try again.")}
      </p>
      <Button
        variant="outline"
        onClick={onRetry}
        className="text-sm font-medium"
      >
        <RefreshCw className="mr-2 size-3.5" />
        {t("Retry")}
      </Button>
    </div>
  );
}

function EmptyState({
  filtered,
  onReset,
}: {
  filtered: boolean;
  onReset: () => void;
}) {
  const { t } = useAdminI18n();
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-14 text-center">
      <BellRing className="size-8 text-muted-foreground" />
      <p className="text-lg font-semibold">
        {filtered
          ? t("No alert rules match these filters")
          : t("No alert rules found")}
      </p>
      <p className="text-sm text-muted-foreground font-normal">
        {filtered
          ? t("Try changing your filters.")
          : t("User alert rules will appear here once they are configured.")}
      </p>
      {filtered && (
        <Button
          variant="outline"
          onClick={onReset}
          className="text-sm font-medium"
        >
          {t("Reset Filters")}
        </Button>
      )}
    </div>
  );
}
