"use client";

import { useMemo, useState } from "react";
import { AlertCircle, BellOff, BellPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationSummary } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAdminUsersQuery } from "@/features/user-manager/api";
import { useGetAdminNotificationsQuery } from "./api";
import type { AdminNotificationItem, AdminNotificationQueryParams } from "./types";
import NotificationDetailSheet from "./components/NotificationDetailSheet";
import NotificationFilterToolbar, { DEFAULT_NOTIFICATION_FILTERS, type NotificationFilters } from "./components/NotificationFilterToolbar";
import NotificationTable from "./components/NotificationTable";
import SendNotificationDialog from "./components/SendNotificationDialog";
import { useAdminI18n } from "@/i18n/admin-i18n";

export default function NotificationManager() {
  const { t } = useAdminI18n();
  const [filters, setFilters] = useState<NotificationFilters>(DEFAULT_NOTIFICATION_FILTERS);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [selectedNotification, setSelectedNotification] = useState<AdminNotificationItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const queryParams = useMemo<AdminNotificationQueryParams>(() => ({
    userId: filters.user?.id,
    notificationType: filters.notificationType === "ALL" ? undefined : filters.notificationType,
    referenceType: filters.referenceType === "ALL" ? undefined : filters.referenceType,
    read: filters.read === "ALL" ? undefined : filters.read === "READ",
    createdFrom: filters.createdFrom,
    createdTo: filters.createdTo,
    pageNumber,
    pageSize,
    sortBy: "createdAt",
    sortDirection,
  }), [filters, pageNumber, pageSize, sortDirection]);

  const { data, isLoading, isFetching, isError, refetch } = useGetAdminNotificationsQuery(queryParams);
  const { data: recipientData } = useGetAdminUsersQuery({ pageNumber: 0, pageSize: 200 });
  const notifications = useMemo(() => data?.content ?? [], [data?.content]);
  const page = data?.page;
  const totalElements = page?.totalElements ?? 0;
  const totalPages = page?.totalPages ?? 0;
  const usersById = useMemo(
    () => new Map((recipientData?.content ?? []).map((user) => [user.id, user])),
    [recipientData?.content],
  );

  const filteredNotifications = useMemo(() => {
    if (!filters.search?.trim()) return notifications;
    const term = filters.search.toLowerCase().trim();
    return notifications.filter((item) => {
      const user = usersById.get(item.userId);
      const metadata = item.metadata as Record<string, unknown> | undefined;
      const metaName = (
        (typeof metadata?.recipientName === "string" && metadata.recipientName) ||
        (typeof metadata?.userName === "string" && metadata.userName) ||
        (typeof metadata?.targetName === "string" && metadata.targetName) ||
        (typeof metadata?.fullName === "string" && metadata.fullName) ||
        ""
      ).toLowerCase();
      const metaEmail = (
        (typeof metadata?.email === "string" && metadata.email) ||
        (typeof metadata?.recipientEmail === "string" && metadata.recipientEmail) ||
        (typeof metadata?.targetEmail === "string" && metadata.targetEmail) ||
        ""
      ).toLowerCase();
      const name = (
        user?.displayName ||
        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
        user?.username ||
        metaName
      ).toLowerCase();
      const email = (user?.email || metaEmail).toLowerCase();
      const title = (item.title || "").toLowerCase();
      const message = (item.message || "").toLowerCase();
      const notifType = (item.notificationType || "").toLowerCase();
      const refType = (item.referenceType || "").toLowerCase();
      const refId = (item.referenceId || "").toLowerCase();
      return (
        title.includes(term) ||
        message.includes(term) ||
        name.includes(term) ||
        email.includes(term) ||
        notifType.includes(term) ||
        refType.includes(term) ||
        refId.includes(term)
      );
    });
  }, [notifications, filters.search, usersById]);

  const hasFilters =
    Boolean(filters.search?.trim()) ||
    !!filters.user ||
    filters.notificationType !== "ALL" ||
    filters.referenceType !== "ALL" ||
    filters.read !== "ALL" ||
    !!filters.createdFrom ||
    !!filters.createdTo;
  const startItem = totalElements === 0 ? 0 : pageNumber * pageSize + 1;
  const endItem = Math.min((pageNumber + 1) * pageSize, totalElements);
  const pageNumbers = useMemo(() => {
    const start = Math.max(0, Math.min(pageNumber - 2, totalPages - 5));
    return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  }, [pageNumber, totalPages]);

  function updateFilters(next: NotificationFilters) {
    setFilters(next);
    setPageNumber(0);
  }

  function resetFilters() {
    setFilters(DEFAULT_NOTIFICATION_FILTERS);
    setPageNumber(0);
  }

  function openDetails(notification: AdminNotificationItem) {
    setSelectedNotification(notification);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-7 font-google-sans">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003377] dark:text-[#FFC83D] md:text-[32px]">{t("Notifications")}</h1>
          <p className="mt-1 text-[18px] leading-relaxed text-muted-foreground font-normal">{t("Monitor notification activity, delivery, and system messages.")}</p>
        </div>
        <Button size="lg" onClick={() => setSendOpen(true)} className="bg-[#FFC83D] text-base font-medium text-[#003377] hover:bg-[#f0ba33]">
          <BellPlus className="mr-2 size-4" />
          {t("Send Notification")}
        </Button>
      </header>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardContent className="space-y-5 p-4 sm:p-6">
          <NotificationFilterToolbar filters={filters} onChange={updateFilters} onReset={resetFilters} />

          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
              <AlertCircle className="size-8 text-destructive" />
              <div>
                <p className="text-lg font-semibold text-foreground">{t("Unable to load notifications.")}</p>
                <p className="mt-1 text-sm text-muted-foreground font-normal">{t("Please try again.")}</p>
              </div>
              <Button variant="outline" onClick={() => refetch()} className="text-sm font-medium">
                <RefreshCw className="mr-2 size-3.5" />{t("Retry")}
              </Button>
            </div>
          ) : !isLoading && filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-muted"><BellOff className="size-6 text-muted-foreground" /></span>
              <div>
                <p className="text-lg font-semibold text-foreground">{hasFilters ? t("No notifications found") : t("No notifications yet")}</p>
                <p className="mt-1 text-sm text-muted-foreground font-normal">
                  {hasFilters ? t("There are no notifications matching the current filters.") : t("System notifications will appear here.")}
                </p>
              </div>
              <Button variant={hasFilters ? "outline" : "default"} onClick={hasFilters ? resetFilters : () => setSendOpen(true)} className={!hasFilters ? "bg-[#FFC83D] text-base font-medium text-[#003377] hover:bg-[#f0ba33]" : "text-base font-medium"}>
                {hasFilters ? t("Reset Filters") : t("Send Notification")}
              </Button>
            </div>
          ) : (
            <>
              <NotificationTable
                notifications={filteredNotifications}
                usersById={usersById}
                isLoading={isLoading || isFetching}
                sortDirection={sortDirection}
                onSortDirectionChange={(direction) => {
                  setSortDirection(direction);
                  setPageNumber(0);
                }}
                onView={openDetails}
              />

              <div className="flex flex-col items-center justify-between gap-4 pt-1 text-base sm:flex-row">
                <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
                  <PaginationSummary
                    start={startItem}
                    end={endItem}
                    total={totalElements}
                    entityName={t("Notifications")}
                  />
                  <div className="admin-page-size">
                    <Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPageNumber(0); }}>
                      <SelectTrigger className="h-9 w-32 text-xs"><SelectValue placeholder={t(`${pageSize} / page`)} /></SelectTrigger>
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
                      <PaginationItem><PaginationPrevious disabled={pageNumber === 0} onClick={() => setPageNumber((value) => Math.max(0, value - 1))} /></PaginationItem>
                      {pageNumbers.map((number) => <PaginationItem key={number}><PaginationLink isActive={number === pageNumber} onClick={() => setPageNumber(number)}>{number + 1}</PaginationLink></PaginationItem>)}
                      <PaginationItem><PaginationNext disabled={pageNumber >= totalPages - 1} onClick={() => setPageNumber((value) => Math.min(totalPages - 1, value + 1))} /></PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <NotificationDetailSheet
        notification={selectedNotification}
        user={selectedNotification ? usersById.get(selectedNotification.userId) : undefined}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <SendNotificationDialog open={sendOpen} onOpenChange={setSendOpen} />
    </div>
  );
}
