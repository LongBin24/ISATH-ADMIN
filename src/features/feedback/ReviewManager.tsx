"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  Bug,
  CircleCheck,
  CircleDot,
  Clock3,
  Eye,
  Heart,
  Image as ImageIcon,
  Lightbulb,
  MessageCircleWarning,
  MessagesSquare,
  MessageSquareText,
  MoreHorizontal,
  RefreshCw,
  Save,
  Search,
  Star,
  Trash2,
  X,
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
import { useGetAdminUsersQuery } from "@/features/user-manager/api";
import type { AdminUser } from "@/features/user-manager/types";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";
import {
  useDeleteReviewMutation,
  useGetAdminReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewStatusMutation,
} from "./api";
import type {
  Review,
  ReviewQueryParams,
  ReviewStatus,
  ReviewType,
} from "./types";

type TypeFilter = "ALL" | ReviewType;
type StatusFilter = "ALL" | ReviewStatus;
type SortOption = "NEWEST" | "OLDEST" | "UPDATED";

const TYPE_META: Record<
  ReviewType,
  { label: string; icon: typeof Bug; classes: string }
> = {
  SUGGESTION: {
    label: "Suggestion",
    icon: Lightbulb,
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  },
  BUG_REPORT: {
    label: "Bug Report",
    icon: Bug,
    classes:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300",
  },
  COMPLAINT: {
    label: "Complaint",
    icon: MessageCircleWarning,
    classes:
      "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900 dark:bg-orange-950/60 dark:text-orange-300",
  },
  COMPLIMENT: {
    label: "Compliment",
    icon: Heart,
    classes:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900 dark:bg-pink-950/60 dark:text-pink-300",
  },
  GENERAL: {
    label: "General",
    icon: MessagesSquare,
    classes:
      "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

const STATUS_META: Record<ReviewStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "Pending",
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300",
  },
  IN_REVIEW: {
    label: "In Review",
    classes:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300",
  },
  RESOLVED: {
    label: "Resolved",
    classes:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  CLOSED: {
    label: "Closed",
    classes:
      "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

function displayName(user?: AdminUser) {
  return (
    user?.displayName ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    user?.username ||
    "User"
  );
}

function initials(user?: AdminUser) {
  return (
    displayName(user)
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"
  );
}

function dateText(value?: string | null, exact = false) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return exact
    ? format(date, "PPp")
    : formatDistanceToNow(date, { addSuffix: true });
}

function safeError(error: unknown, fallback: string) {
  if (typeof error !== "object" || error === null || !("data" in error))
    return fallback;
  const data = (error as { data?: unknown }).data;
  if (typeof data !== "object" || data === null || !("message" in data))
    return fallback;
  const message = (data as { message?: unknown }).message;
  return typeof message === "string" && message.length < 240
    ? message
    : fallback;
}

export default function ReviewManager() {
  const { t } = useAdminI18n();
  const [type, setType] = useState<TypeFilter>("ALL");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("NEWEST");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const params = useMemo<ReviewQueryParams>(
    () => ({
      ...(type !== "ALL" ? { type } : {}),
      ...(status !== "ALL" ? { status } : {}),
      page,
      size,
      sort:
        sort === "OLDEST"
          ? ["createdAt,ASC"]
          : sort === "UPDATED"
            ? ["updatedAt,DESC"]
            : ["createdAt,DESC"],
    }),
    [page, size, sort, status, type],
  );
  const reviewsQuery = useGetAdminReviewsQuery(params);
  const totalQuery = useGetAdminReviewsQuery({ page: 0, size: 1 });
  const pendingQuery = useGetAdminReviewsQuery({
    status: "PENDING",
    page: 0,
    size: 1,
  });
  const inReviewQuery = useGetAdminReviewsQuery({
    status: "IN_REVIEW",
    page: 0,
    size: 1,
  });
  const resolvedQuery = useGetAdminReviewsQuery({
    status: "RESOLVED",
    page: 0,
    size: 1,
  });
  const usersQuery = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 200 });
  const [deleteReview, deleteState] = useDeleteReviewMutation();
  const reviews = reviewsQuery.data?.content ?? [];
  const usersById = useMemo(
    () =>
      new Map((usersQuery.data?.content ?? []).map((user) => [user.id, user])),
    [usersQuery.data?.content],
  );

  const filteredReviews = useMemo(() => {
    if (!search.trim()) return reviews;
    const term = search.toLowerCase().trim();
    return reviews.filter((review) => {
      const user = usersById.get(review.userId);
      const name = displayName(user).toLowerCase();
      const title = (review.title || "").toLowerCase();
      const description = (review.description || "").toLowerCase();
      const note = (review.latestReviewNote || "").toLowerCase();
      return (
        title.includes(term) ||
        description.includes(term) ||
        name.includes(term) ||
        note.includes(term)
      );
    });
  }, [reviews, search, usersById]);

  const totalPages = reviewsQuery.data?.totalPages ?? 0;
  const totalElements = reviewsQuery.data?.totalElements ?? 0;
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const hasFilters = Boolean(
    search.trim() || type !== "ALL" || status !== "ALL" || sort !== "NEWEST",
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
    setType("ALL");
    setStatus("ALL");
    setSort("NEWEST");
    setPage(0);
  }
  function openReview(review: Review) {
    setSelectedId(review.id);
    setSheetOpen(true);
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget.id).unwrap();
      toast.success(t("Review deleted successfully."));
      if (selectedId === deleteTarget.id) {
        setSheetOpen(false);
        setSelectedId(null);
      }
      setDeleteTarget(null);
    } catch (error) {
      toast.error(safeError(error, t("Unable to delete this review.")));
    }
  }

  const statsLoading =
    totalQuery.isLoading ||
    pendingQuery.isLoading ||
    inReviewQuery.isLoading ||
    resolvedQuery.isLoading;
  const first = totalElements ? safePage * size + 1 : 0;
  const last = Math.min((safePage + 1) * size, totalElements);

  return (
    <div className="space-y-7 font-google-sans">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-[32px]">
          {t("Reviews & Feedback")}
        </h1>
        <p className="mt-1 max-w-3xl text-[18px] leading-relaxed text-muted-foreground font-normal">
          {t(
            "Review and manage user suggestions, bug reports, complaints, compliments, and general feedback.",
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
              icon={MessageSquareText}
              label={t("Total Reviews")}
              value={totalQuery.data?.totalElements ?? "N/A"}
              helper={t("User submissions")}
            />
            <StatCard
              icon={Clock3}
              label={t("Pending")}
              value={pendingQuery.data?.totalElements ?? "N/A"}
              helper={t("Awaiting review")}
            />
            <StatCard
              icon={CircleDot}
              label={t("In Review")}
              value={inReviewQuery.data?.totalElements ?? "N/A"}
              helper={t("Currently handled")}
            />
            <StatCard
              icon={CircleCheck}
              label={t("Resolved")}
              value={resolvedQuery.data?.totalElements ?? "N/A"}
              helper={t("Completed reviews")}
            />
          </>
        )}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#003377] dark:text-[#FFC83D] md:text-xl">
            {t("Reviews")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            {t("Monitor and manage feedback submitted by iStash users.")}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={cn(
              "grid gap-2 md:grid-cols-2 xl:items-center",
              hasFilters
                ? "xl:grid-cols-[minmax(240px,3.5fr)_repeat(4,minmax(140px,1fr))]"
                : "xl:grid-cols-[minmax(280px,4.5fr)_repeat(3,minmax(140px,1fr))]",
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
              <ReviewSelect
                label="Type"
                value={type}
                options={{
                  ALL: t("All Types"),
                  SUGGESTION: t("Suggestion"),
                  BUG_REPORT: t("Bug Report"),
                  COMPLAINT: t("Complaint"),
                  COMPLIMENT: t("Compliment"),
                  GENERAL: t("General"),
                }}
                onChange={(value) => {
                  setType(value as TypeFilter);
                  setPage(0);
                }}
              />
              <ReviewSelect
                label="Status"
                value={status}
                options={{
                  ALL: t("All Statuses"),
                  PENDING: t("Pending"),
                  IN_REVIEW: t("In Review"),
                  RESOLVED: t("Resolved"),
                  CLOSED: t("Closed"),
                }}
                onChange={(value) => {
                  setStatus(value as StatusFilter);
                  setPage(0);
                }}
              />
              <ReviewSelect
                label="Sort"
                value={sort}
                options={{
                  NEWEST: t("Newest First"),
                  OLDEST: t("Oldest First"),
                  UPDATED: t("Recently Updated"),
                }}
                onChange={(value) => {
                  setSort(value as SortOption);
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
          {reviewsQuery.isError ? (
            <ErrorState onRetry={() => reviewsQuery.refetch()} />
          ) : reviewsQuery.isLoading ? (
            <TableSkeleton />
          ) : filteredReviews.length === 0 ? (
            <EmptyState filtered={hasFilters} onReset={resetFilters} />
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-border">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="min-w-72 text-base font-semibold">
                        {t("Review")}
                      </TableHead>
                      <TableHead className="min-w-48 text-base font-semibold">
                        {t("User")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Type")}
                      </TableHead>
                      <TableHead className="text-base font-semibold">
                        {t("Rating")}
                      </TableHead>
                      <TableHead className="min-w-32 text-base font-semibold">
                        {t("Status")}
                      </TableHead>
                      <TableHead className="min-w-36 text-base font-semibold">
                        {t("Created")}
                      </TableHead>
                      <TableHead className="w-14 text-right text-base font-semibold">
                        {t("Actions")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <ReviewRow
                        key={review.id}
                        review={review}
                        user={usersById.get(review.userId)}
                        onView={() => openReview(review)}
                        onDelete={() => setDeleteTarget(review)}
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
                    entityName={t("Reviews")}
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

      <ReviewDetailSheet
        reviewId={selectedId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        usersById={usersById}
        onDelete={(review) => setDeleteTarget(review)}
      />
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete this review?")}</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}”{" "}
              {t(
                "will be removed from review management. This action cannot be undone.",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteState.isLoading}
              onClick={() => setDeleteTarget(null)}
            >
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteState.isLoading}
              onClick={confirmDelete}
            >
              {deleteState.isLoading ? (
                <RefreshCw className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              {deleteState.isLoading ? t("Deleting...") : t("Delete Review")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof Star;
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

function ReviewSelect({
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
  const isSelected = value !== "ALL" && value !== "NEWEST";
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-11 rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
          compact ? "admin-page-size w-32" : "min-w-[140px]",
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

function TypeBadge({ type }: { type: ReviewType }) {
  const { t } = useAdminI18n();
  const meta = TYPE_META[type] ?? TYPE_META.GENERAL;
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={`gap-1.5 text-sm ${meta.classes}`}>
      <Icon className="size-3.5" />
      {t(meta.label)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const { t } = useAdminI18n();
  const meta = STATUS_META[status];
  return (
    <Badge variant="outline" className={`text-sm ${meta.classes}`}>
      {t(meta.label)}
    </Badge>
  );
}

function UserIdentity({ user }: { user?: AdminUser }) {
  const { t } = useAdminI18n();
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarImage src={user?.profileImageUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(user)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-base font-medium">{displayName(user)}</p>
        <p className="truncate text-sm text-muted-foreground font-normal">
          {user?.email || t("User details unavailable")}
        </p>
      </div>
    </div>
  );
}

function Rating({
  value,
  detailed = false,
}: {
  value: number | null;
  detailed?: boolean;
}) {
  const rating = Math.max(0, Math.min(5, value ?? 0));
  return (
    <div className="flex items-center gap-2">
      <div className="flex" aria-label={`${value ?? "No"} rating out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`size-4 ${index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/35"}`}
          />
        ))}
      </div>
      <span
        className={
          detailed ? "text-base font-medium" : "text-base font-semibold"
        }
      >
        {value == null ? "N/A" : detailed ? `${value} / 5` : value}
      </span>
    </div>
  );
}

function ReviewRow({
  review,
  user,
  onView,
  onDelete,
}: {
  review: Review;
  user?: AdminUser;
  onView: () => void;
  onDelete: () => void;
}) {
  const { t } = useAdminI18n();
  return (
    <TableRow className="cursor-pointer" onClick={onView}>
      <TableCell className="py-4">
        <p className="max-w-72 truncate text-base font-semibold">
          {review.title}
        </p>
        <p className="mt-1 max-w-72 truncate text-sm text-muted-foreground font-normal">
          {review.description}
        </p>
      </TableCell>
      <TableCell className="py-4">
        <UserIdentity user={user} />
      </TableCell>
      <TableCell className="py-4">
        <TypeBadge type={review.reviewType} />
      </TableCell>
      <TableCell className="py-4">
        <Rating value={review.overallRating} />
      </TableCell>
      <TableCell className="py-4">
        <StatusBadge status={review.reviewStatus} />
      </TableCell>
      <TableCell className="py-4 text-sm text-muted-foreground font-normal">
        <Tooltip>
          <TooltipTrigger>{dateText(review.createdAt)}</TooltipTrigger>
          <TooltipContent>{dateText(review.createdAt, true)}</TooltipContent>
        </Tooltip>
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
              aria-label={`${review.title} actions`}
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
            <DropdownMenuItem onClick={onView}>
              <CircleDot className="size-4" />
              {t("Update Status")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={onDelete}>
              <Trash2 className="size-4" />
              {t("Delete Review")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function ReviewDetailSheet({
  reviewId,
  open,
  onOpenChange,
  usersById,
  onDelete,
}: {
  reviewId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usersById: Map<string, AdminUser>;
  onDelete: (review: Review) => void;
}) {
  const { t } = useAdminI18n();
  const detailQuery = useGetReviewByIdQuery(reviewId ?? "", {
    skip: !reviewId || !open,
  });
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="max-w-[620px]"
        onClose={() => onOpenChange(false)}
      >
        <SheetHeader>
          <SheetTitle className="text-[#003377] dark:text-[#FEDB55] ">
            {t("Review Details")}
          </SheetTitle>
        </SheetHeader>
        {detailQuery.isLoading ? (
          <SheetBody>
            <DetailSkeleton />
          </SheetBody>
        ) : detailQuery.isError || !detailQuery.data ? (
          <SheetBody>
            <ErrorState onRetry={() => detailQuery.refetch()} />
          </SheetBody>
        ) : (
          <ReviewDetail
            key={`${detailQuery.data.id}-${detailQuery.data.updatedAt}`}
            review={detailQuery.data}
            submitter={usersById.get(detailQuery.data.userId)}
            reviewer={
              detailQuery.data.reviewedBy
                ? usersById.get(detailQuery.data.reviewedBy)
                : undefined
            }
            onDelete={() => onDelete(detailQuery.data)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function ReviewDetail({
  review,
  submitter,
  reviewer,
  onDelete,
}: {
  review: Review;
  submitter?: AdminUser;
  reviewer?: AdminUser;
  onDelete: () => void;
}) {
  const { t } = useAdminI18n();
  const [reviewStatus, setReviewStatus] = useState(review.reviewStatus);
  const [note, setNote] = useState(review.latestReviewNote ?? "");
  const [screenshotOpen, setScreenshotOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [update, updateState] = useUpdateReviewStatusMutation();

  async function save() {
    try {
      await update({
        id: review.id,
        reviewStatus,
        latestReviewNote: note,
      }).unwrap();
      toast.success(t("Review updated successfully."));
    } catch (error) {
      toast.error(safeError(error, t("Unable to update review status.")));
    }
  }

  return (
    <>
      <SheetBody>
        <section>
          <h2 className="text-2xl font-semibold">{review.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <TypeBadge type={review.reviewType} />
            <StatusBadge status={review.reviewStatus} />
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm text-muted-foreground font-normal">
              {t("Submitted by")}
            </p>
            <UserIdentity user={submitter} />
          </div>
        </section>
        <Separator />
        <section>
          <h3 className="text-lg font-semibold">{t("Description")}</h3>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-muted-foreground font-normal">
            {review.description}
          </p>
        </section>
        <Separator />
        <section>
          <h3 className="text-lg font-semibold">{t("Ratings")}</h3>
          <div className="mt-3 space-y-3 rounded-2xl bg-muted/40 p-4">
            <RatingRow label={t("Overall")} value={review.overallRating} />
            <RatingRow label={t("User Interface")} value={review.uiRating} />
            <RatingRow
              label={t("Performance")}
              value={review.performanceRating}
            />
            <RatingRow
              label={t("Ease of Use")}
              value={review.easeOfUseRating}
            />
            <RatingRow label={t("Features")} value={review.featureRating} />
          </div>
        </section>
        <Separator />
        <section>
          <h3 className="text-lg font-semibold">{t("Screenshot")}</h3>
          {review.screenshotUrl && !imageFailed ? (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setScreenshotOpen(true)}
                className="relative h-56 w-full overflow-hidden rounded-2xl border bg-muted/30 p-2"
              >
                <Image
                  unoptimized
                  fill
                  sizes="(max-width: 640px) 100vw, 580px"
                  src={review.screenshotUrl}
                  alt={`Screenshot for ${review.title}`}
                  onError={() => setImageFailed(true)}
                  className="object-contain p-2"
                />
              </button>
              <Button
                variant="outline"
                className="mt-3 text-base font-medium"
                onClick={() => setScreenshotOpen(true)}
              >
                <ImageIcon className="mr-2 size-4" />
                {t("View Full Screenshot")}
              </Button>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed p-5 text-base text-muted-foreground">
              <ImageIcon className="size-5" />
              {t("No screenshot attached")}
            </div>
          )}
        </section>
        <Separator />
        <section>
          <h3 className="text-lg font-semibold">{t("Review Management")}</h3>
          {review.latestReviewNote && (
            <div className="mt-3 rounded-xl bg-muted/50 p-3">
              <p className="text-base font-medium">{t("Latest Review Note")}</p>
              <p className="mt-1 text-base text-muted-foreground font-normal">
                {review.latestReviewNote}
              </p>
            </div>
          )}
          <div className="mt-4">
            <label className="text-base font-medium">{t("Status")}</label>
            <div className="mt-2">
              <ReviewSelect
                value={reviewStatus}
                options={{
                  PENDING: t("Pending"),
                  IN_REVIEW: t("In Review"),
                  RESOLVED: t("Resolved"),
                  CLOSED: t("Closed"),
                }}
                onChange={(value) => setReviewStatus(value as ReviewStatus)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="review-note" className="text-base font-medium">
              {t("Review Note")}
            </label>
            <textarea
              id="review-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder={t(
                "Add a note about how this review is being handled...",
              )}
              className="mt-2 w-full resize-y rounded-xl border border-input bg-background px-3 py-2.5 text-base font-normal outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button
            className="mt-4 bg-[#FEDB55] text-base font-medium text-[#003377] hover:bg-[#f0ca43]"
            disabled={updateState.isLoading}
            onClick={save}
          >
            {updateState.isLoading ? (
              <RefreshCw className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            {updateState.isLoading ? t("Saving...") : t("Save Changes")}
          </Button>
        </section>
        <Separator />
        <section>
          <h3 className="text-lg font-semibold">{t("Review Information")}</h3>
          <div className="mt-2 divide-y">
            <InfoRow
              label={t("Reviewed By")}
              value={
                review.reviewedBy
                  ? displayName(reviewer)
                  : t("Not reviewed yet")
              }
            />
            <InfoRow
              label={t("Reviewed At")}
              value={dateText(review.reviewedAt, true)}
            />
            <InfoRow
              label={t("Created At")}
              value={dateText(review.createdAt, true)}
            />
            <InfoRow
              label={t("Updated At")}
              value={dateText(review.updatedAt, true)}
            />
          </div>
        </section>
      </SheetBody>
      <SheetFooter className="justify-between">
        <Button
          variant="ghost"
          className="text-base font-medium text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 size-4" />
          {t("Delete Review")}
        </Button>
      </SheetFooter>
      <ScreenshotDialog
        open={screenshotOpen}
        onOpenChange={setScreenshotOpen}
        url={review.screenshotUrl}
        title={review.title}
      />
    </>
  );
}

function RatingRow({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-base font-medium">{label}</span>
      <Rating value={value} detailed />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <span className="text-base text-muted-foreground font-normal">
        {label}
      </span>
      <span className="text-right text-base font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function ScreenshotDialog({
  open,
  onOpenChange,
  url,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
  title: string;
}) {
  const { t } = useAdminI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-5xl overflow-auto"
        onClose={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>{t("Review Screenshot")}</DialogTitle>
          <DialogDescription className="text-base font-normal">
            {t("Screenshot attached to")} “{title}”.
          </DialogDescription>
        </DialogHeader>
        {url && (
          <div className="relative min-h-72 w-full rounded-xl bg-muted/40">
            <Image
              unoptimized
              width={1600}
              height={1200}
              src={url}
              alt={`Full screenshot for ${title}`}
              className="max-h-[75vh] h-auto w-full object-contain p-3"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-9 w-3/4" />
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
      <MessageSquareText className="size-8 text-destructive" />
      <p className="text-lg font-semibold">{t("Unable to load reviews.")}</p>
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
      <MessageSquareText className="size-8 text-muted-foreground" />
      <p className="text-base font-semibold">
        {filtered ? t("No reviews found") : t("No reviews yet")}
      </p>
      <p className="text-xs text-muted-foreground font-normal">
        {filtered
          ? t("No reviews match the selected filters.")
          : t("User feedback and reports will appear here when submitted.")}
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
