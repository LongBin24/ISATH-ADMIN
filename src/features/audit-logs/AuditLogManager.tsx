"use client";

import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  Activity,
  Calendar,
  Clock3,
  Copy,
  Database,
  Eye,
  FileCode,
  Globe,
  Hash,
  Layers,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  User,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";
import {
  useGetAuditLogByIdQuery,
  useGetAuditLogsByEntityQuery,
  useGetAuditLogsQuery,
} from "./api";
import type {
  AuditActionFilter,
  AuditEntityTypeFilter,
  AuditLog,
  AuditLogQueryParams,
} from "./types";

function dateText(value?: string | null, exact = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return exact ? format(date, "PPpp") : formatDistanceToNow(date, { addSuffix: true });
}

export function AuditLogManager() {
  const { t } = useAdminI18n();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditActionFilter>("ALL");
  const [entityTypeFilter, setEntityTypeFilter] =
    useState<AuditEntityTypeFilter>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const queryParams = useMemo<AuditLogQueryParams>(() => {
    const params: AuditLogQueryParams = {
      page,
      size,
    };
    if (search.trim()) params.search = search.trim();
    if (actionFilter !== "ALL") params.action = actionFilter;
    if (entityTypeFilter !== "ALL") params.entityType = entityTypeFilter;
    return params;
  }, [page, size, search, actionFilter, entityTypeFilter]);

  const auditQuery = useGetAuditLogsQuery(queryParams);
  const totalQuery = useGetAuditLogsQuery({ page: 0, size: 1 });
  const createQuery = useGetAuditLogsQuery({ action: "CREATE", page: 0, size: 1 });
  const updateQuery = useGetAuditLogsQuery({ action: "UPDATE", page: 0, size: 1 });
  const suspendQuery = useGetAuditLogsQuery({ action: "SUSPEND", page: 0, size: 1 });

  const logs = auditQuery.data?.content ?? [];
  const totalElements = auditQuery.data?.totalElements ?? 0;
  const totalPages = auditQuery.data?.totalPages ?? 0;
  const safePage = Math.min(page, Math.max(0, totalPages - 1));

  const filteredLogs = useMemo(() => {
    let result = [...logs];
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.action.toLowerCase().includes(term) ||
          item.entityType.toLowerCase().includes(term) ||
          item.entityId.toLowerCase().includes(term) ||
          (item.ipAddress && item.ipAddress.toLowerCase().includes(term)) ||
          (item.userId && item.userId.toLowerCase().includes(term)) ||
          item.id.toLowerCase().includes(term)
      );
    }
    if (actionFilter !== "ALL") {
      result = result.filter(
        (item) => item.action.toUpperCase() === actionFilter.toUpperCase()
      );
    }
    if (entityTypeFilter !== "ALL") {
      result = result.filter(
        (item) =>
          item.entityType.toUpperCase() === entityTypeFilter.toUpperCase()
      );
    }
    return result;
  }, [logs, search, actionFilter, entityTypeFilter]);

  const hasFilters = Boolean(
    search.trim() || actionFilter !== "ALL" || entityTypeFilter !== "ALL"
  );

  const pageNumbers = useMemo(() => {
    const start = Math.max(0, Math.min(safePage - 2, totalPages - 5));
    return Array.from(
      { length: Math.min(5, totalPages) },
      (_, index) => start + index
    );
  }, [safePage, totalPages]);

  function resetFilters() {
    setSearch("");
    setActionFilter("ALL");
    setEntityTypeFilter("ALL");
    setPage(0);
  }

  function openDetail(item: AuditLog) {
    setSelectedLog(item);
    setSheetOpen(true);
  }

  const statsLoading =
    totalQuery.isLoading ||
    createQuery.isLoading ||
    updateQuery.isLoading ||
    suspendQuery.isLoading;

  const first = totalElements ? safePage * size + 1 : 0;
  const last = Math.min((safePage + 1) * size, totalElements);

  return (
    <div className="space-y-7 font-google-sans">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">
            {t("Audit Logs")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground font-normal">
            {t(
              "Track, monitor, and review all administrative and system events, mutations, and security activities."
            )}
          </p>
        </div>
      </header>

      {/* KPI Stats Grid */}
      <div className="admin-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={Activity}
              label={t("Total Audit Logs")}
              value={totalQuery.data?.totalElements ?? totalElements}
              helper={t("All logged events")}
            />
            <StatCard
              icon={ShieldCheck}
              label={t("Creation Events")}
              value={createQuery.data?.totalElements ?? "—"}
              helper={t("Create operations")}
            />
            <StatCard
              icon={Layers}
              label={t("Update Events")}
              value={updateQuery.data?.totalElements ?? "—"}
              helper={t("Modifications and updates")}
            />
            <StatCard
              icon={ShieldAlert}
              label={t("Security Actions")}
              value={suspendQuery.data?.totalElements ?? "—"}
              helper={t("Suspensions & sensitive actions")}
            />
          </>
        )}
      </div>

      {/* Main Content Card */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {t("System Audit Trail")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {t(
              "Comprehensive history of user and administrator actions across the platform."
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Filters Row */}
          <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                placeholder={t(
                  "Search by action, entity type, user ID, or IP..."
                )}
                className="h-11 rounded-xl pl-9 pr-8 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(0);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label={t("Action")}
                value={actionFilter}
                options={{
                  ALL: t("All Actions"),
                  CREATE: t("CREATE"),
                  UPDATE: t("UPDATE"),
                  DELETE: t("DELETE"),
                  SUSPEND: t("SUSPEND"),
                  REACTIVATE: t("REACTIVATE"),
                  LOGIN: t("LOGIN"),
                  LOGOUT: t("LOGOUT"),
                }}
                onChange={(val) => {
                  setActionFilter(val as AuditActionFilter);
                  setPage(0);
                }}
              />

              <FilterSelect
                label={t("Entity Type")}
                value={entityTypeFilter}
                options={{
                  ALL: t("All Entity Types"),
                  CONTACT_MESSAGE: t("Contact Message"),
                  USER: t("User Account"),
                  CATEGORY: t("Category"),
                  CURRENCY: t("Currency"),
                  ALERT_RULE: t("Alert Rule"),
                  PROMPT_TEMPLATE: t("Prompt Template"),
                  SYSTEM: t("System / Auth"),
                }}
                onChange={(val) => {
                  setEntityTypeFilter(val as AuditEntityTypeFilter);
                  setPage(0);
                }}
              />

              {hasFilters && (
                <Button
                  variant="ghost"
                  className="h-11 shrink-0 rounded-xl px-3 text-sm font-medium"
                  onClick={resetFilters}
                >
                  {t("Reset")}
                </Button>
              )}
            </div>
          </div>

          {/* Table / Error / Loading / Empty */}
          {auditQuery.isError ? (
            <ErrorState onRetry={() => auditQuery.refetch()} />
          ) : auditQuery.isLoading ? (
            <TableSkeleton />
          ) : filteredLogs.length === 0 ? (
            <EmptyState filtered={hasFilters} onReset={resetFilters} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-32 text-base font-semibold">
                        {t("Action")}
                      </TableHead>
                      <TableHead className="min-w-44 text-base font-semibold">
                        {t("Entity Type")}
                      </TableHead>
                      <TableHead className="min-w-44 text-base font-semibold">
                        {t("Actor / User ID")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("IP Address")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Timestamp")}
                      </TableHead>
                      <TableHead className="w-14 text-right text-base font-semibold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((item) => (
                      <AuditLogRow
                        key={item.id}
                        item={item}
                        onView={() => openDetail(item)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-base sm:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                  <PaginationSummary
                    start={first}
                    end={last}
                    total={totalElements}
                    entityName={t("audit logs")}
                  />
                  <div className="admin-page-size">
                    <Select
                      value={String(size)}
                      onValueChange={(val) => {
                        setSize(Number(val));
                        setPage(0);
                      }}
                    >
                      <SelectTrigger className="h-9 w-32 text-xs">
                        <SelectValue placeholder={t(`${size} / page`)} />
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
                          onClick={() => setPage((p) => Math.max(0, p - 1))}
                        />
                      </PaginationItem>
                      {pageNumbers.map((num) => (
                        <PaginationItem key={num}>
                          <PaginationLink
                            isActive={num === safePage}
                            onClick={() => setPage(num)}
                          >
                            {num + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          disabled={safePage + 1 >= totalPages}
                          onClick={() =>
                            setPage((p) => Math.min(totalPages - 1, p + 1))
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

      {/* Detail Popup Sheet */}
      <AuditDetailSheet
        log={selectedLog}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
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
  icon: typeof Activity;
  label: string;
  value: React.ReactNode;
  helper: string;
}) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="flex gap-4 p-5 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:text-[#FEDB55]">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground font-normal">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}) {
  const isSelected = value !== "ALL";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 rounded-xl text-sm font-medium transition hover:border-[#003377] dark:hover:border-[#FFC83D] min-w-[150px]",
          isSelected &&
            "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
        )}
      >
        <SelectValue placeholder={label} value={options[value]} />
      </SelectTrigger>
      <SelectContent value={value} onValueChange={onChange} className="rounded-xl">
        {Object.entries(options).map(([key, labelText]) => (
          <SelectItem key={key} value={key}>
            {labelText}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ActionBadge({ action }: { action: string }) {
  const act = action.toUpperCase();
  if (act === "CREATE") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
      >
        CREATE
      </Badge>
    );
  }
  if (act === "UPDATE") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
      >
        UPDATE
      </Badge>
    );
  }
  if (act === "DELETE") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 font-semibold"
      >
        DELETE
      </Badge>
    );
  }
  if (act === "SUSPEND") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
      >
        SUSPEND
      </Badge>
    );
  }
  if (act === "REACTIVATE" || act === "ACTIVATE") {
    return (
      <Badge
        variant="outline"
        className="gap-1 border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
      >
        {act}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold"
    >
      {act}
    </Badge>
  );
}

function EntityTypeBadge({ entityType }: { entityType: string }) {
  return (
    <Badge
      variant="secondary"
      className="font-mono text-xs font-semibold uppercase tracking-wider"
    >
      {entityType.replace(/_/g, " ")}
    </Badge>
  );
}

function AuditLogRow({
  item,
  onView,
}: {
  item: AuditLog;
  onView: () => void;
}) {
  const { t } = useAdminI18n();

  return (
    <TableRow className="cursor-pointer hover:bg-muted/30" onClick={onView}>
      <TableCell className="py-4">
        <ActionBadge action={item.action} />
      </TableCell>
      <TableCell className="py-4">
        <EntityTypeBadge entityType={item.entityType} />
      </TableCell>
      <TableCell className="py-4 text-sm text-muted-foreground">
        {item.userId ? (
          <span className="inline-flex items-center gap-1 font-mono text-xs text-foreground">
            <User className="size-3 text-slate-400" />
            <span className="max-w-36 truncate">{item.userId}</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <UserX className="size-3" />
            {t("Guest / System")}
          </span>
        )}
      </TableCell>
      <TableCell className="py-4 text-sm font-mono text-muted-foreground">
        {item.ipAddress ? (
          <span className="inline-flex items-center gap-1">
            <Globe className="size-3 text-slate-400" />
            {item.ipAddress}
          </span>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell className="py-4 text-sm text-muted-foreground font-normal">
        <Tooltip>
          <TooltipTrigger>{dateText(item.createdAt)}</TooltipTrigger>
          <TooltipContent>{dateText(item.createdAt, true)}</TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell
        className="py-4 text-right"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("Audit log actions")}
              className="size-8.5 rounded-xl border border-slate-200/80 bg-transparent text-slate-600 shadow-2xs transition hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]"
            >
              <MoreHorizontal className="size-4.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-2xl p-1 font-google-sans shadow-xl border-slate-200/80 dark:border-slate-800"
          >
            <DropdownMenuItem
              onClick={onView}
              className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold"
            >
              <Eye className="size-4 text-[#003377] dark:text-[#FFC83D]" />
              {t("View Details")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function AuditDetailSheet({
  log,
  open,
  onOpenChange,
}: {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useAdminI18n();

  const { data: detailData, isLoading, isError, refetch } =
    useGetAuditLogByIdQuery(log?.id ?? "", {
      skip: !log?.id || !open,
    });

  const activeLog = detailData || log;

  const { data: entityLogs } = useGetAuditLogsByEntityQuery(
    {
      entityType: activeLog?.entityType ?? "",
      entityId: activeLog?.entityId ?? "",
      page: 0,
      size: 5,
    },
    {
      skip: !activeLog?.entityId || !open,
    }
  );

  if (!open) return null;

  const copyAll = () => {
    if (activeLog) {
      navigator.clipboard.writeText(JSON.stringify(activeLog, null, 2));
      toast.success(t("Audit event details copied!"));
    }
  };

  const copyPayload = (payload: any, label: string) => {
    if (payload !== undefined && payload !== null) {
      navigator.clipboard.writeText(
        typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)
      );
      toast.success(`${label} ${t("Copied!")}`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="max-w-[640px] rounded-3xl p-0 font-google-sans overflow-hidden"
        onClose={() => onOpenChange(false)}
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-200/80 bg-slate-50/60 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#003377]/10 text-[#003377] shadow-2xs dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
              <Shield className="size-5.5" />
            </span>
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("Audit Log Details")}
              </SheetTitle>
              <p className="mt-0.5 text-xs text-muted-foreground font-normal">
                {t("Complete record of the captured administrative event.")}
              </p>
            </div>
          </div>
        </SheetHeader>

        {isLoading && !activeLog ? (
          <SheetBody className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-44 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </SheetBody>
        ) : isError && !activeLog ? (
          <SheetBody className="p-6">
            <ErrorState onRetry={() => refetch()} />
          </SheetBody>
        ) : activeLog ? (
          <SheetBody className="space-y-5 p-6 overflow-y-auto max-h-[calc(100vh-145px)]">
            {/* Action, Entity & Timestamp Banner */}
            <section className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-slate-100/40 p-4.5 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-800/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <ActionBadge action={activeLog.action} />
                  <EntityTypeBadge entityType={activeLog.entityType} />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300">
                  <Clock3 className="size-3.5 text-slate-400" />
                  <span>{dateText(activeLog.createdAt)}</span>
                </div>
              </div>

              <div className="mt-3.5 flex items-center gap-2 text-xs text-muted-foreground border-t border-slate-200/60 pt-3 dark:border-slate-800/80">
                <Calendar className="size-3.5 text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {dateText(activeLog.createdAt, true)}
                </span>
              </div>
            </section>

            {/* Actor & Origin Information */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {t("Actor & Origin")}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Actor Card */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <User className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground">
                      {t("Actor")}
                    </p>
                    <p className="mt-0.5 truncate font-semibold text-xs text-slate-900 dark:text-white">
                      {activeLog.userId || t("System / Guest")}
                    </p>
                  </div>
                </div>

                {/* IP Address Card */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Globe className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {t("IP Address")}
                      </p>
                      {activeLog.ipAddress && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeLog.ipAddress!);
                            toast.success(t("IP Address copied!"));
                          }}
                          className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          <Copy className="size-2.5" />
                          {t("Copy")}
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                      {activeLog.ipAddress || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Agent / Client if available */}
              {activeLog.userAgent && (
                <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Terminal className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {t("User Agent")}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeLog.userAgent!);
                          toast.success(t("Copied!"));
                        }}
                        className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <Copy className="size-2.5" />
                        {t("Copy")}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                      {activeLog.userAgent}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* State Changes & Payload (oldValues / newValues) */}
            {(activeLog.oldValues !== undefined || activeLog.newValues !== undefined) && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("State Changes & Payload")}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <FileCode className="size-3" />
                    JSON
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {/* Before Mutation (oldValues) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        <span className="size-1.5 rounded-full bg-rose-500" />
                        {t("Before Mutation (oldValues)")}
                      </span>
                      {activeLog.oldValues && (
                        <button
                          type="button"
                          onClick={() => copyPayload(activeLog.oldValues, "Before payload")}
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {t("Copy")}
                        </button>
                      )}
                    </div>
                    {activeLog.oldValues ? (
                      <pre className="max-h-52 overflow-y-auto rounded-xl border border-rose-200/60 bg-rose-50/40 p-3 font-mono text-[11px] leading-relaxed text-slate-800 dark:border-rose-950/60 dark:bg-rose-950/20 dark:text-rose-200">
                        {JSON.stringify(activeLog.oldValues, null, 2)}
                      </pre>
                    ) : (
                      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="text-[11px] italic text-slate-500">
                          {t("Initial creation (no prior state)")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* After Mutation (newValues) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        {t("After Mutation (newValues)")}
                      </span>
                      {activeLog.newValues && (
                        <button
                          type="button"
                          onClick={() => copyPayload(activeLog.newValues, "After payload")}
                          className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        >
                          {t("Copy")}
                        </button>
                      )}
                    </div>
                    {activeLog.newValues ? (
                      <pre className="max-h-52 overflow-y-auto rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 font-mono text-[11px] leading-relaxed text-slate-800 dark:border-emerald-950/60 dark:bg-emerald-950/20 dark:text-emerald-200">
                        {JSON.stringify(activeLog.newValues, null, 2)}
                      </pre>
                    ) : (
                      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center text-xs text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
                        <p className="text-[11px] italic text-slate-500">
                          {t("No new state recorded")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Entity Mutation History (Timeline) */}
            {entityLogs && entityLogs.totalElements > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {t("Entity Mutation History")}
                    </p>
                    <Badge variant="secondary" className="px-2 py-0.5 text-[10px] font-semibold">
                      {entityLogs.totalElements} {t("events")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {entityLogs.content.map((item) => {
                    const isCurrent = item.id === activeLog.id;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between rounded-xl border p-3 text-xs transition",
                          isCurrent
                            ? "border-[#003377]/40 bg-[#003377]/5 dark:border-[#FFC83D]/40 dark:bg-[#FFC83D]/10"
                            : "border-slate-200/70 bg-slate-50/40 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <ActionBadge action={item.action} />
                          <span className="font-medium text-xs text-slate-700 dark:text-slate-300 truncate max-w-44">
                            {item.userId || t("System / Guest")}
                          </span>
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="border-[#003377]/30 bg-white text-[10px] font-bold text-[#003377] dark:border-[#FFC83D]/40 dark:bg-slate-900 dark:text-[#FFC83D]"
                            >
                              {t("Current Event")}
                            </Badge>
                          )}
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                          {dateText(item.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </SheetBody>
        ) : null}

        {/* Footer */}
        <SheetFooter className="flex-row items-center justify-between border-t border-slate-200/80 bg-slate-50/60 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <Button
            variant="outline"
            className="h-10.5 rounded-xl px-4.5 text-xs font-semibold"
            onClick={() => onOpenChange(false)}
          >
            {t("Close")}
          </Button>

          <Button
            className="h-10.5 gap-2 rounded-xl bg-[#FEDB55] px-5 text-xs font-bold text-[#003377] shadow-sm hover:bg-[#f0ca43]"
            onClick={copyAll}
          >
            <Copy className="size-3.5" />
            {t("Copy JSON Event")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
      <ShieldAlert className="size-8 text-destructive" />
      <p className="text-lg font-semibold">{t("Unable to load audit logs")}</p>
      <p className="text-sm text-muted-foreground font-normal">{t("Please try again.")}</p>
      <Button variant="outline" onClick={onRetry} className="text-sm font-medium">
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
      <Shield className="size-8 text-muted-foreground" />
      <p className="text-base font-semibold">
        {filtered ? t("No audit logs found") : t("No audit logs recorded yet")}
      </p>
      <p className="text-xs text-muted-foreground font-normal">
        {filtered
          ? t("No audit log events match the current filter or search criteria.")
          : t("Administrative and mutation events will be recorded and displayed here.")}
      </p>
      {filtered && (
        <Button variant="outline" onClick={onReset} className="text-xs font-medium">
          {t("Reset Filters")}
        </Button>
      )}
    </div>
  );
}

export default AuditLogManager;
