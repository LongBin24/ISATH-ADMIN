"use client";

import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Coins,
  Database,
  Eye,
  MoreHorizontal,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import {
  useActivateCurrencyMutation,
  useDeactivateCurrencyMutation,
  useGetCurrenciesQuery,
  useGetProviderStatusQuery,
  useSynchronizeCurrenciesMutation,
} from "./CurrencyApi";
import type { CurrencyItem, ProviderStatus, SyncResponse } from "./types";
import { useAdminI18n } from "@/i18n/admin-i18n";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";
type CurrencyAction = {
  currency: CurrencyItem;
  action: "activate" | "deactivate";
} | null;
const PAGE_SIZE = 10;

function paginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5)
    return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages: Array<number | "start-ellipsis" | "end-ellipsis"> = [1];
  if (currentPage > 3) pages.push("start-ellipsis");
  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  )
    pages.push(page);
  if (currentPage < totalPages - 2) pages.push("end-ellipsis");
  pages.push(totalPages);
  return pages;
}

function safeDate(value?: string, exact = false) {
  if (!value) return "Never synced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never synced";
  return exact
    ? format(date, "PPp")
    : formatDistanceToNow(date, { addSuffix: true });
}

function isHealthy(status?: ProviderStatus) {
  return status?.status === "HEALTHY";
}

function CurrencyStatusBadge({ active }: { active: boolean }) {
  const { t } = useAdminI18n();
  return (
    <Badge
      variant="outline"
      className={
        active
          ? "gap-1.5 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
          : "gap-1.5 border-slate-200 bg-slate-100 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }
    >
      {active ? (
        <CheckCircle2 className="size-3.5" />
      ) : (
        <XCircle className="size-3.5" />
      )}
      {t(active ? "Active" : "Inactive")}
    </Badge>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Coins;
  label: string;
  value: React.ReactNode;
  helper: string;
}) {
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardContent className="flex items-start gap-4 p-5 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FEDB55]/10 dark:text-[#FEDB55]">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="mt-1 text-3xl font-semibold text-foreground">
            {value}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProviderCard({
  provider,
  isLoading,
  isError,
  onRetry,
  onSynchronize,
  isSyncing,
}: {
  provider?: ProviderStatus;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSynchronize: () => void;
  isSyncing: boolean;
}) {
  const { t } = useAdminI18n();
  if (isLoading)
    return (
      <Card className="rounded-2xl">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  if (isError || !provider) {
    return (
      <Card className="rounded-2xl border-destructive/30">
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-base font-semibold text-foreground">
            {t("Unable to load provider status.")}
          </p>
          <Button
            variant="outline"
            onClick={onRetry}
            className="text-sm font-medium"
          >
            <RefreshCw className="mr-2 size-3.5" />
            {t("Retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const healthy = isHealthy(provider);
  return (
    <Card className="rounded-2xl border-border shadow-sm">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {t("Currency Provider")}
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground font-normal">
            {t("Live provider availability and synchronization state.")}
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            healthy
              ? "gap-1.5 border-emerald-200 bg-emerald-50 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "gap-1.5 border-amber-200 bg-amber-50 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
          }
        >
          {healthy ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <TriangleAlert className="size-4" />
          )}
          {healthy ? t("Healthy") : t("Provider Issue")}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 rounded-2xl bg-muted/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProviderMetric
            label={t("Provider")}
            value={provider.provider || "—"}
          />
          <ProviderMetric
            label={t("Last Attempt")}
            value={safeDate(provider.lastAttemptAt, true)}
          />
          <ProviderMetric
            label={t("Last Successful Sync")}
            value={safeDate(provider.lastSuccessfulSyncAt, true)}
          />
          <ProviderMetric
            label={t("Currencies Received")}
            value={provider.currenciesReceived?.toLocaleString() ?? "—"}
          />
          <ProviderMetric
            label={t("Rates Updated")}
            value={provider.ratesUpdated?.toLocaleString() ?? "—"}
          />
          <ProviderMetric
            label={t("Data Status")}
            value={provider.stale ? t("Data may be outdated") : t("Up to date")}
          />
        </div>

        {(provider.lastError || provider.stale) && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  {t("Currency provider issue")}
                </p>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  {provider.lastError ||
                    provider.message ||
                    "The latest provider data may be outdated."}
                </p>
                <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
                  Last successful synchronization:{" "}
                  {safeDate(provider.lastSuccessfulSyncAt, true)}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isSyncing}
                  onClick={onSynchronize}
                  className="mt-3 border-amber-300 bg-white text-sm text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-200 dark:hover:bg-amber-900/60"
                >
                  <RefreshCw
                    className={`mr-2 size-3.5 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  {t("Try Synchronization")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProviderMetric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground font-normal">{label}</p>
      <div className="mt-1 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

export default function CurrencyManager() {
  const { t } = useAdminI18n();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<CurrencyAction>(null);
  const [syncResult, setSyncResult] = useState<SyncResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const currenciesQuery = useGetCurrenciesQuery();
  const providerQuery = useGetProviderStatusQuery();
  const [synchronize, { isLoading: isSyncing }] =
    useSynchronizeCurrenciesMutation();
  const [activate, { isLoading: isActivating }] = useActivateCurrencyMutation();
  const [deactivate, { isLoading: isDeactivating }] =
    useDeactivateCurrencyMutation();
  const currencies = useMemo(
    () => currenciesQuery.data ?? [],
    [currenciesQuery.data],
  );
  const activeCount = currencies.filter((currency) => currency.active).length;
  const inactiveCount = currencies.length - activeCount;
  const filteredCurrencies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return currencies.filter((currency) => {
      const matchesQuery =
        !normalized ||
        [currency.code, currency.name, currency.symbol].some((value) =>
          value?.toLowerCase().includes(normalized),
        );
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" ? currency.active : !currency.active);
      return matchesQuery && matchesStatus;
    });
  }, [currencies, query, statusFilter]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCurrencies.length / PAGE_SIZE),
  );
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedCurrencies = useMemo(
    () =>
      filteredCurrencies.slice(
        (visiblePage - 1) * PAGE_SIZE,
        visiblePage * PAGE_SIZE,
      ),
    [filteredCurrencies, visiblePage],
  );
  const firstVisibleCurrency =
    filteredCurrencies.length === 0 ? 0 : (visiblePage - 1) * PAGE_SIZE + 1;
  const lastVisibleCurrency = Math.min(
    visiblePage * PAGE_SIZE,
    filteredCurrencies.length,
  );

  async function handleSynchronize() {
    try {
      const result = await synchronize().unwrap();
      setSyncResult(result);
      await Promise.all([currenciesQuery.refetch(), providerQuery.refetch()]);
      const status = result.status.toUpperCase();
      if (status === "FAILED")
        toast.error(result.errorMessage || "Currency synchronization failed.");
      else
        toast.success(
          status === "STARTED"
            ? "Synchronization started successfully."
            : status === "SUCCESS" || status === "COMPLETED"
              ? "Synchronization completed successfully."
              : "Synchronization request accepted.",
        );
    } catch {
      toast.error("Unable to synchronize currencies.");
    }
  }

  async function confirmAction() {
    if (!pendingAction) return;
    const { currency, action } = pendingAction;
    try {
      const updated =
        action === "activate"
          ? await activate(currency.code).unwrap()
          : await deactivate(currency.code).unwrap();
      if (selectedCurrency?.code === updated.code) setSelectedCurrency(updated);
      toast.success(
        `${currency.code} ${action === "activate" ? "activated" : "deactivated"} successfully.`,
      );
      setPendingAction(null);
    } catch {
      toast.error(`Unable to ${action} ${currency.code}.`);
    }
  }

  function resetFilters() {
    setQuery("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-7 font-google-sans">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">
            {t("Currency Management")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground font-normal">
            {t(
              "Manage supported currencies, exchange-rate synchronization, and provider availability.",
            )}
          </p>
        </div>
        <Button
          size="lg"
          disabled={isSyncing}
          onClick={handleSynchronize}
          className="bg-[#FEDB55] text-base font-medium text-[#003377] hover:bg-[#f0ca43]"
        >
          <RefreshCw
            className={`mr-2 size-4 ${isSyncing ? "animate-spin" : ""}`}
          />
          {isSyncing ? t("Synchronizing...") : t("Synchronize")}
        </Button>
      </header>

      {currenciesQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="admin-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Coins}
            label={t("Total Currencies")}
            value={currencies.length.toLocaleString()}
            helper={t("Available currencies")}
          />
          <StatCard
            icon={CheckCircle2}
            label={t("Active Currencies")}
            value={activeCount.toLocaleString()}
            helper={t("Enabled in iStash")}
          />
          <StatCard
            icon={XCircle}
            label={t("Inactive Currencies")}
            value={inactiveCount.toLocaleString()}
            helper={t("Currently disabled")}
          />
          <StatCard
            icon={Activity}
            label={t("Provider Health")}
            value={
              <span className="inline-flex items-center gap-2 text-2xl">
                {isHealthy(providerQuery.data) ? (
                  <CheckCircle2 className="size-5 text-emerald-600" />
                ) : (
                  <TriangleAlert className="size-5 text-amber-600" />
                )}
                {providerQuery.isLoading
                  ? t("Loading")
                  : isHealthy(providerQuery.data)
                    ? t("Healthy")
                    : t("Issue")}
              </span>
            }
            helper={
              providerQuery.data?.stale
                ? t("Data may be outdated")
                : t("Provider availability")
            }
          />
        </div>
      )}

      <ProviderCard
        provider={providerQuery.data}
        isLoading={providerQuery.isLoading}
        isError={providerQuery.isError}
        onRetry={() => providerQuery.refetch()}
        onSynchronize={handleSynchronize}
        isSyncing={isSyncing}
      />

      {syncResult && (
        <Card className="rounded-2xl border-[#003377]/20 bg-[#003377]/[0.03] shadow-sm">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <Database className="mt-0.5 size-5 text-[#003377] dark:text-[#FEDB55]" />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {syncResult.status === "STARTED"
                    ? "Synchronization started"
                    : "លិទ្ធផល​ ការធ្វើសមកាលកម្ម"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-normal">
                  Provider: {syncResult.provider}
                </p>
                {syncResult.errorMessage && (
                  <p className="mt-2 text-sm text-destructive">
                    {syncResult.errorMessage}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
              <ProviderMetric
                label={t("Currencies Received")}
                value={syncResult.currenciesReceived ?? "—"}
              />
              <ProviderMetric
                label={t("Currencies Received")}
                value={syncResult.currenciesUpdated ?? "—"}
              />
              <ProviderMetric
                label={t("Rates Updated")}
                value={syncResult.ratesReceived ?? "—"}
              />
              <ProviderMetric
                label={t("Rates Updated")}
                value={syncResult.ratesUpdated ?? "—"}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {t("Supported Currencies")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {t("Manage which synchronized currencies are enabled in iStash.")}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="filter-card flex flex-col gap-3 text-base sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t("Search by currency code or name...")}
                className="h-11 rounded-xl pl-9 text-base"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as StatusFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-xl text-base sm:w-48">
                <SelectValue
                  value={
                    {
                      ALL: t("All Statuses"),
                      ACTIVE: t("Active"),
                      INACTIVE: t("Inactive"),
                    }[statusFilter]
                  }
                />
              </SelectTrigger>
              <SelectContent
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectItem value="ALL">{t("All Statuses")}</SelectItem>
                <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
                <SelectItem value="INACTIVE">{t("Inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {currenciesQuery.isError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-14 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-base font-semibold">
                {t("Unable to load currency information.")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("Please try again.")}
              </p>
              <Button
                variant="outline"
                onClick={() => currenciesQuery.refetch()}
                className="text-sm font-medium"
              >
                {t("Retry")}
              </Button>
            </div>
          ) : !currenciesQuery.isLoading && filteredCurrencies.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
              <Coins className="size-8 text-muted-foreground" />
              <p className="text-base font-semibold">
                {currencies.length
                  ? t("No currencies found")
                  : t("No currencies available")}
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                {currencies.length
                  ? t("Try changing your search or status filter.")
                  : t(
                      "Synchronize with the configured currency provider to retrieve supported currencies.",
                    )}
              </p>
              <Button
                variant={currencies.length ? "outline" : "default"}
                onClick={currencies.length ? resetFilters : handleSynchronize}
                className="text-sm font-medium"
              >
                {currencies.length ? t("Reset Filters") : t("Synchronize")}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="min-w-48 text-base font-semibold">
                      {t("Currency")}
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      {t("Symbol")}
                    </TableHead>
                    <TableHead className="min-w-32 text-base font-semibold">
                      {t("Decimal Places")}
                    </TableHead>
                    <TableHead className="min-w-44 text-base font-semibold">
                      {t("Provider")}
                    </TableHead>
                    <TableHead className="min-w-36 text-base font-semibold">
                      {t("Last Synced")}
                    </TableHead>
                    <TableHead className="text-base font-semibold">
                      {t("Status")}
                    </TableHead>
                    <TableHead className="w-14 text-right text-base font-semibold">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currenciesQuery.isLoading
                    ? Array.from({ length: 7 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={7} className="py-4">
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    : paginatedCurrencies.map((currency) => (
                        <TableRow
                          key={currency.code}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setDetailOpen(true);
                          }}
                        >
                          <TableCell className="py-4">
                            <p className="text-base font-semibold text-foreground">
                              {currency.code}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {currency.name}
                            </p>
                          </TableCell>
                          <TableCell className="py-4 text-xl font-medium text-foreground">
                            {currency.symbol}
                          </TableCell>
                          <TableCell className="py-4 text-base text-foreground">
                            {currency.decimalPlaces ?? 2}{" "}
                            {t(
                              (currency.decimalPlaces ?? 2) === 1
                                ? "decimal"
                                : "decimals",
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="block max-w-40 truncate text-base text-foreground">
                                  {currency.provider || "—"}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                {currency.provider || "—"}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="py-4 text-base text-muted-foreground">
                            {currency.lastSyncedAt ? (
                              <Tooltip>
                                <TooltipTrigger>
                                  {safeDate(currency.lastSyncedAt)}
                                </TooltipTrigger>
                                <TooltipContent>
                                  {safeDate(currency.lastSyncedAt, true)}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              t("Never synced")
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <CurrencyStatusBadge active={currency.active} />
                          </TableCell>
                          <TableCell
                            className="py-4 text-right"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`${currency.code} actions`}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCurrency(currency);
                                    setDetailOpen(true);
                                  }}
                                >
                                  <Eye className="size-4" />
                                  {t("View Details")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  destructive={currency.active}
                                  onClick={() =>
                                    setPendingAction({
                                      currency,
                                      action: currency.active
                                        ? "deactivate"
                                        : "activate",
                                    })
                                  }
                                >
                                  {currency.active ? (
                                    <PowerOff className="size-4" />
                                  ) : (
                                    <Power className="size-4" />
                                  )}
                                  {t(
                                    currency.active
                                      ? "Deactivate Currency"
                                      : "Activate Currency",
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!currenciesQuery.isLoading &&
            !currenciesQuery.isError &&
            filteredCurrencies.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border pt-4 text-base lg:flex-row lg:items-center lg:justify-between">
                <p className="text-base text-muted-foreground font-normal">
                  {t("Showing")} {firstVisibleCurrency}–{lastVisibleCurrency}{" "}
                  {t("of")} {filteredCurrencies.length.toLocaleString()}{" "}
                  {t("currencies")}
                </p>
                <Pagination className="mx-0 w-auto justify-start lg:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        disabled={visiblePage === 1}
                        onClick={() =>
                          setCurrentPage(Math.max(1, visiblePage - 1))
                        }
                      />
                    </PaginationItem>
                    {paginationItems(visiblePage, totalPages).map((item) => (
                      <PaginationItem key={item}>
                        {typeof item === "number" ? (
                          <PaginationLink
                            isActive={item === visiblePage}
                            aria-label={`Go to page ${item}`}
                            onClick={() => setCurrentPage(item)}
                          >
                            {item}
                          </PaginationLink>
                        ) : (
                          <PaginationEllipsis />
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        disabled={visiblePage === totalPages}
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, visiblePage + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
        </CardContent>
      </Card>

      <CurrencyDetailSheet
        currency={selectedCurrency}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAction={(currency) =>
          setPendingAction({
            currency,
            action: currency.active ? "deactivate" : "activate",
          })
        }
      />
      <CurrencyActionDialog
        action={pendingAction}
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onConfirm={confirmAction}
        isLoading={isActivating || isDeactivating}
      />
    </div>
  );
}

function CurrencyDetailSheet({
  currency,
  open,
  onOpenChange,
  onAction,
}: {
  currency: CurrencyItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (currency: CurrencyItem) => void;
}) {
  const { t } = useAdminI18n();
  if (!currency) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent onClose={() => onOpenChange(false)}>
        <SheetHeader>
          <SheetTitle>{t("Currency Details")}</SheetTitle>
          <p className="mt-1 text-sm text-muted-foreground font-normal">
            {t("Provider and synchronization information for")} {currency.code}.
          </p>
        </SheetHeader>
        <SheetBody>
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#003377]/10 text-xl font-semibold text-[#003377] dark:text-[#FEDB55]">
              {currency.symbol}
            </span>
            <div>
              <h3 className="text-2xl font-semibold text-foreground">
                {currency.code}
              </h3>
              <p className="text-base text-muted-foreground font-normal">
                {currency.name ? t(currency.name) : ""}
              </p>
            </div>
          </div>
          <Separator />
          <div className="divide-y divide-border">
            <DetailField label={t("Status")}>
              <CurrencyStatusBadge active={currency.active} />
            </DetailField>
            <DetailField label={t("Symbol")}>{currency.symbol}</DetailField>
            <DetailField label={t("Decimal Places")}>
              {currency.decimalPlaces ?? 2}
            </DetailField>
            <DetailField label={t("Provider")}>
              {currency.provider || "—"}
            </DetailField>
            <DetailField label={t("Last Synced")}>
              {safeDate(currency.lastSyncedAt, true)}
            </DetailField>
            <DetailField label={t("Created")}>
              {currency.createdAt ? safeDate(currency.createdAt, true) : "—"}
            </DetailField>
            <DetailField label={t("Updated")}>
              {currency.updatedAt ? safeDate(currency.updatedAt, true) : "—"}
            </DetailField>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button
            variant={currency.active ? "destructive" : "default"}
            onClick={() => onAction(currency)}
            className="text-base font-medium"
          >
            {currency.active ? (
              <PowerOff className="mr-2 size-4" />
            ) : (
              <Power className="mr-2 size-4" />
            )}
            {t(currency.active ? "Deactivate Currency" : "Activate Currency")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DetailField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-base text-muted-foreground font-normal">
        {label}
      </span>
      <div className="text-right text-base font-medium text-foreground">
        {children}
      </div>
    </div>
  );
}

function CurrencyActionDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: {
  action: CurrencyAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  const { t } = useAdminI18n();
  if (!action) return null;
  const activating = action.action === "activate";
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {activating ? t("Activate Currency") : t("Deactivate Currency")} (
            {action.currency.code})
          </AlertDialogTitle>
          <AlertDialogDescription>
            {activating
              ? t(
                  "This currency will become available where active currencies are supported.",
                )
              : t(
                  "This will disable this currency for operations where only active currencies can be selected. Review backend business rules for downstream effects.",
                )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={activating ? "default" : "destructive"}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : activating ? (
              <Power className="mr-2 size-4" />
            ) : (
              <PowerOff className="mr-2 size-4" />
            )}
            {isLoading
              ? t("Updating...")
              : activating
                ? t("Activate Currency")
                : t("Deactivate Currency")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
