"use client";

import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  Calendar,
  Clock3,
  Copy,
  Eye,
  Hash,
  Mail,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";
import { useGetContactByIdQuery, useGetContactMessagesQuery } from "./api";
import type {
  ContactMessage,
  ContactQueryParams,
  ContactSortOption,
  UserTypeFilter,
} from "./types";

function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function dateText(value?: string | null, exact = false) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return exact
    ? format(date, "PPp")
    : formatDistanceToNow(date, { addSuffix: true });
}

export function ContactUsManager() {
  const { t } = useAdminI18n();
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState<UserTypeFilter>("ALL");
  const [sortBy, setSortBy] = useState<ContactSortOption>("NEWEST");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const queryParams = useMemo<ContactQueryParams>(() => {
    const params: ContactQueryParams = {
      page,
      size,
    };
    if (search.trim()) params.search = search.trim();
    if (userType === "REGISTERED") params.registeredUser = true;
    if (userType === "GUEST") params.registeredUser = false;
    if (sortBy === "NEWEST") {
      params.sortBy = "createdAt";
      params.sortDirection = "DESC";
    } else if (sortBy === "OLDEST") {
      params.sortBy = "createdAt";
      params.sortDirection = "ASC";
    } else if (sortBy === "NAME") {
      params.sortBy = "name";
      params.sortDirection = "ASC";
    }
    return params;
  }, [page, size, search, userType, sortBy]);

  const contactQuery = useGetContactMessagesQuery(queryParams);
  const totalQuery = useGetContactMessagesQuery({ page: 0, size: 1 });
  const registeredQuery = useGetContactMessagesQuery({
    registeredUser: true,
    page: 0,
    size: 1,
  });
  const guestQuery = useGetContactMessagesQuery({
    registeredUser: false,
    page: 0,
    size: 1,
  });

  const messages = contactQuery.data?.content ?? [];
  const totalElements = contactQuery.data?.totalElements ?? 0;
  const totalPages = contactQuery.data?.totalPages ?? 0;
  const safePage = Math.min(page, Math.max(0, totalPages - 1));

  const filteredMessages = useMemo(() => {
    let result = [...messages];
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.email.toLowerCase().includes(term) ||
          (m.phone && m.phone.includes(term)) ||
          m.subject.toLowerCase().includes(term) ||
          (m.messagePreview && m.messagePreview.toLowerCase().includes(term)) ||
          (m.message && m.message.toLowerCase().includes(term)),
      );
    }
    if (userType === "REGISTERED") {
      result = result.filter((m) => m.registeredUser);
    } else if (userType === "GUEST") {
      result = result.filter((m) => !m.registeredUser);
    }
    if (sortBy === "NEWEST") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "OLDEST") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sortBy === "NAME") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  }, [messages, search, userType, sortBy]);

  const hasFilters = Boolean(
    search.trim() || userType !== "ALL" || sortBy !== "NEWEST",
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
    setUserType("ALL");
    setSortBy("NEWEST");
    setPage(0);
  }

  function openDetail(item: ContactMessage) {
    setSelectedId(item.id);
    setSheetOpen(true);
  }

  const statsLoading =
    totalQuery.isLoading || registeredQuery.isLoading || guestQuery.isLoading;

  const first = totalElements ? safePage * size + 1 : 0;
  const last = Math.min((safePage + 1) * size, totalElements);

  return (
    <div className="space-y-7 font-google-sans">
      {/* Consistent Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-3xl">
            {t("Contact Us Inquiries")}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground font-normal">
            {t(
              "Manage, view, and respond to incoming contact requests from registered users and public visitors.",
            )}
          </p>
        </div>
      </header>

      {/* Consistent Stat Grid */}
      <div className="admin-stat-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              icon={Mail}
              label={t("Total Messages")}
              value={totalQuery.data?.totalElements ?? totalElements}
              helper={t("All customer inquiries")}
            />
            <StatCard
              icon={UserCheck}
              label={t("Registered Users")}
              value={registeredQuery.data?.totalElements ?? "N/A"}
              helper={t("From logged-in accounts")}
            />
            <StatCard
              icon={UserX}
              label={t("Guest Inquiries")}
              value={guestQuery.data?.totalElements ?? "N/A"}
              helper={t("From public contact form")}
            />
            <StatCard
              icon={Clock3}
              label={t("Today's Messages")}
              value={
                messages.filter((m) => {
                  try {
                    const d = new Date(m.createdAt);
                    const now = new Date();
                    return (
                      d.getDate() === now.getDate() &&
                      d.getMonth() === now.getMonth() &&
                      d.getFullYear() === now.getFullYear()
                    );
                  } catch {
                    return false;
                  }
                }).length
              }
              helper={t("Received today")}
            />
          </>
        )}
      </div>

      {/* Main Content Card */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold md:text-xl">
            {t("Contact Messages")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {t(
              "Monitor, search, and respond to inquiries submitted through the contact form.",
            )}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Filters Row */}
          <div
            className={cn(
              "grid gap-2 md:grid-cols-2 xl:items-center",
              hasFilters
                ? "xl:grid-cols-[minmax(240px,3.5fr)_repeat(3,minmax(140px,1fr))]"
                : "xl:grid-cols-[minmax(280px,4.5fr)_repeat(2,minmax(140px,1fr))]",
            )}
          >
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(0);
                }}
                placeholder={t("Search user...")}
                className="h-11 rounded-xl bg-background pl-10 pr-9 text-sm shadow-sm"
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
            <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 xl:contents">
              <FilterSelect
                label={t("User Type")}
                value={userType}
                options={{
                  ALL: t("All User Types"),
                  REGISTERED: t("Registered Users"),
                  GUEST: t("Guest Inquiries"),
                }}
                onChange={(val) => {
                  setUserType(val as UserTypeFilter);
                  setPage(0);
                }}
              />
              <FilterSelect
                label={t("Sort")}
                value={sortBy}
                options={{
                  NEWEST: t("Newest First"),
                  OLDEST: t("Oldest First"),
                  NAME: t("Sender Name"),
                }}
                onChange={(val) => {
                  setSortBy(val as ContactSortOption);
                  setPage(0);
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

          {/* Body: Error / Loading / Empty / Table */}
          {contactQuery.isError ? (
            <ErrorState onRetry={() => contactQuery.refetch()} />
          ) : contactQuery.isLoading ? (
            <TableSkeleton />
          ) : filteredMessages.length === 0 ? (
            <EmptyState filtered={hasFilters} onReset={resetFilters} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-64 text-base font-semibold">
                        {t("Sender")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("User Type")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Phone")}
                      </TableHead>
                      <TableHead className="min-w-72 text-base font-semibold">
                        {t("Subject & Message")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Received")}
                      </TableHead>
                      <TableHead className="w-14 text-right text-base font-semibold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((item) => (
                      <ContactRow
                        key={item.id}
                        item={item}
                        onView={() => openDetail(item)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-4 text-base sm:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                  <PaginationSummary
                    start={first}
                    end={last}
                    total={totalElements}
                    entityName={t("messages")}
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

      {/* Detail View Popup Sheet */}
      <ContactDetailSheet
        contactId={selectedId}
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
  icon: typeof Mail;
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
          <p className="mt-1 text-sm text-muted-foreground font-normal">
            {helper}
          </p>
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
  const isSelected = value !== "ALL" && value !== "NEWEST";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 min-w-[140px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
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
        {Object.entries(options).map(([key, labelText]) => (
          <SelectItem key={key} value={key}>
            {labelText}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function UserTypeBadge({ registeredUser }: { registeredUser: boolean }) {
  const { t } = useAdminI18n();
  return registeredUser ? (
    <Badge
      variant="outline"
      className="gap-1 text-sm border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
    >
      <UserCheck className="size-3.5" />
      {t("Registered User")}
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="gap-1 text-sm border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      <UserX className="size-3.5" />
      {t("Guest")}
    </Badge>
  );
}

function ContactRow({
  item,
  onView,
}: {
  item: ContactMessage;
  onView: () => void;
}) {
  const { t } = useAdminI18n();
  return (
    <TableRow className="cursor-pointer" onClick={onView}>
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-base font-medium">{item.name}</p>
            <p className="truncate text-sm text-muted-foreground font-normal">
              {item.email}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <UserTypeBadge registeredUser={item.registeredUser} />
      </TableCell>
      <TableCell className="py-4 text-base text-muted-foreground font-normal">
        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-[#003377] dark:hover:text-[#FFC83D]"
          >
            {item.phone}
          </a>
        ) : (
          "N/A"
        )}
      </TableCell>
      <TableCell className="py-4">
        <p className="max-w-72 truncate text-base font-semibold">
          {item.subject}
        </p>
        <p className="mt-1 max-w-72 truncate text-sm text-muted-foreground font-normal">
          {item.messagePreview || item.message}
        </p>
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
              aria-label={t("Contact inquiry actions")}
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

function ContactDetailSheet({
  contactId,
  open,
  onOpenChange,
}: {
  contactId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useAdminI18n();
  const detailQuery = useGetContactByIdQuery(contactId ?? "", {
    skip: !contactId || !open,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="max-w-[640px] rounded-3xl p-0 font-google-sans overflow-hidden"
        onClose={() => onOpenChange(false)}
      >
        <SheetHeader className="border-b border-slate-200/80 bg-slate-50/50 px-6 py-5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#003377]/10 text-[#003377] shadow-2xs dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
              <Mail className="size-5" />
            </span>
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("Contact Inquiry Details")}
              </SheetTitle>
              <p className="mt-0.5 text-xs text-muted-foreground font-normal">
                {t("View details and respond to customer message.")}
              </p>
            </div>
          </div>
        </SheetHeader>

        {detailQuery.isLoading ? (
          <SheetBody className="p-6">
            <DetailSkeleton />
          </SheetBody>
        ) : detailQuery.isError || !detailQuery.data ? (
          <SheetBody className="p-6">
            <ErrorState onRetry={() => detailQuery.refetch()} />
          </SheetBody>
        ) : (
          <ContactDetail
            key={detailQuery.data.id}
            data={detailQuery.data}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function ContactDetail({
  data,
  onClose,
}: {
  data: ContactMessage;
  onClose: () => void;
}) {
  const { t } = useAdminI18n();

  const copyInfo = () => {
    navigator.clipboard.writeText(
      `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${
        data.phone || "N/A"
      }\nSubject: ${data.subject}\nMessage: ${data.message || data.messagePreview}`,
    );
    toast.success(t("Contact info copied to clipboard!"));
  };

  return (
    <>
      <SheetBody className="space-y-5 p-6">
        {/* Subject & Status Banner */}
        <section className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <UserTypeBadge registeredUser={data.registeredUser} />
              <Badge
                variant="outline"
                className="gap-1.5 rounded-lg border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <Clock3 className="size-3 text-slate-400" />
                {dateText(data.createdAt)}
              </Badge>
            </div>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white sm:text-xl leading-snug">
            {data.subject}
          </h3>
        </section>

        {/* Sender Profile Card */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3.5 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("Sender Information")}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${data.name} <${data.email}>`);
                toast.success(t("Contact info copied to clipboard!"));
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Copy className="size-3" />
              {t("Copy")}
            </button>
          </div>

          <div className="flex items-start gap-4">
            <Avatar className="size-13 border-2 border-white bg-[#003377] font-bold text-[#FFC83D] shadow-sm ring-1 ring-slate-200 dark:border-slate-800 dark:ring-slate-700">
              <AvatarFallback className="bg-[#003377] text-base font-bold text-[#FFC83D]">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {data.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.registeredUser
                    ? t("Registered User")
                    : t("Guest Inquiry")}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <a
                  href={`mailto:${data.email}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#003377] hover:bg-[#003377]/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D]"
                >
                  <Mail className="size-3.5 text-slate-400" />
                  <span>{data.email}</span>
                </a>

                {data.phone && (
                  <a
                    href={`tel:${data.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#003377] hover:bg-[#003377]/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[#FFC83D]"
                  >
                    <Phone className="size-3.5 text-slate-400" />
                    <span>{data.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Message Content Box */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {t("Message Content")}
            </p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(
                  data.message || data.messagePreview || "",
                );
                toast.success(t("Copied!"));
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <Copy className="size-3" />
              {t("Copy")}
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4.5 text-sm leading-relaxed text-slate-800 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
            <p className="whitespace-pre-wrap">
              {data.message || data.messagePreview}
            </p>
          </div>
        </section>

        {/* Metadata Details Grid */}
        <section>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">
                {t("Received At")}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                {dateText(data.createdAt, true)}
              </p>
            </div>
          </div>
        </section>
      </SheetBody>

      {/* Footer Actions */}
      <SheetFooter className="flex-row items-center justify-between border-t border-slate-200/80 bg-slate-50/40 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/40">
        <Button
          variant="outline"
          className="h-10.5 rounded-xl px-4 text-xs font-semibold"
          onClick={onClose}
        >
          {t("Close")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10.5 gap-1.5 rounded-xl px-3.5 text-xs font-semibold"
            onClick={copyInfo}
          >
            <Copy className="size-3.5" />
            <span className="hidden sm:inline">
              {t("Copy All Information")}
            </span>
            <span className="sm:hidden">{t("Copy")}</span>
          </Button>

          {data.phone && (
            <Button
              variant="outline"
              className="h-10.5 gap-1.5 rounded-xl px-3.5 text-xs font-semibold"
              onClick={() => {
                window.location.href = `tel:${data.phone}`;
              }}
            >
              <Phone className="size-3.5" />
              {t("Call Phone")}
            </Button>
          )}

          <Button
            className="h-10.5 gap-2 rounded-xl bg-[#FEDB55] px-4.5 text-xs font-bold text-[#003377] shadow-sm hover:bg-[#f0ca43]"
            onClick={() => {
              window.open(
                `mailto:${data.email}?subject=Re: ${encodeURIComponent(
                  data.subject,
                )}`,
                "_blank",
              );
            }}
          >
            <Mail className="size-3.5" />
            {t("Reply via Email")}
          </Button>
        </div>
      </SheetFooter>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-24 w-full" />
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
      <Mail className="size-8 text-destructive" />
      <p className="text-lg font-semibold">
        {t("Unable to load contact messages")}
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
      <Mail className="size-8 text-muted-foreground" />
      <p className="text-base font-semibold">
        {filtered ? t("No messages found") : t("No contact messages yet")}
      </p>
      <p className="text-xs text-muted-foreground font-normal">
        {filtered
          ? t(
              "No contact messages match the current search or filter criteria.",
            )
          : t(
              "Incoming messages from website visitors and users will appear here.",
            )}
      </p>
      {filtered && (
        <Button
          variant="outline"
          onClick={onReset}
          className="text-xs font-medium"
        >
          {t("Reset Filters")}
        </Button>
      )}
    </div>
  );
}

export default ContactUsManager;
