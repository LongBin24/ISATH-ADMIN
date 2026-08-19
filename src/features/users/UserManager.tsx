"use client";

<<<<<<< HEAD:src/features/user-manager/UserManager.tsx
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, UserPlus, Users as UsersIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import UserManagementHeader from "./components/UserManagementHeader";
import UserStatCards from "./components/UserStatCards";
import UserGenderChart from "./components/UserGenderChart";
import UserAgeChart from "./components/UserAgeChart";
import UserFilterToolbar, {
  DEFAULT_USER_FILTERS,
  type UserFilters,
} from "./components/UserFilterToolbar";
import UserTable from "./components/UserTable";
import UserDetailSheet from "./components/UserDetailSheet";
import AddUserDialog from "./components/AddUserDialog";
import SuspendUserDialog from "./components/SuspendUserDialog";
import ReactivateUserDialog from "./components/ReactivateUserDialog";
import { useGetAdminUsersQuery } from "./api";
import { AdminUser } from "./types";
import { useAdminI18n } from "@/i18n/admin-i18n";

export default function UserManagerPage() {
  const { t } = useAdminI18n();
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_USER_FILTERS);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
=======
import { useState } from "react";
import { Plus, ChevronLeft, Users } from "lucide-react";
import Createuser from "@/features/dashboard/components/Createuser";
import UserTable from "@/features/dashboard/components/UserTable";
import { useRouter } from "next/navigation";
import { useGetUsersQuery } from "@/features/users/api";
import { useI18n } from "@/hooks/use-i18n";

export default function UserManagerPage() {
  const { locale, dict } = useI18n();
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/features/users/UserManager.tsx

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<AdminUser | null>(null);
  const [reactivateTarget, setReactivateTarget] = useState<AdminUser | null>(null);

  const queryParams = useMemo(
    () => ({
      pageNumber,
      pageSize,
      query: filters.query || undefined,
      accountStatus: filters.accountStatus !== "ALL" ? filters.accountStatus : undefined,
      emailVerified: filters.emailVerified === "ALL" ? undefined : filters.emailVerified === "VERIFIED",
      onboardingCompleted:
        filters.onboardingCompleted === "ALL" ? undefined : filters.onboardingCompleted === "COMPLETED",
      createdFrom: filters.createdFrom,
      createdTo: filters.createdTo,
    }),
    [filters, pageNumber, pageSize]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminUsersQuery(queryParams);

  useEffect(() => {
    if (isError) {
      console.error("[user-manager] GET admin/users failed", error);
    } else if (!isLoading && !isFetching) {
      console.log("[user-manager] GET admin/users response", data);
    }
  }, [isError, error, isLoading, isFetching, data]);

  const users = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_USER_FILTERS);

  function handleFiltersChange(next: UserFilters) {
    setFilters(next);
    setPageNumber(0);
  }

  function handleViewDetails(user: AdminUser) {
    setDetailUserId(user.id);
    setDetailOpen(true);
  }

  const startItem = totalElements === 0 ? 0 : pageNumber * pageSize + 1;
  const endItem = Math.min((pageNumber + 1) * pageSize, totalElements);

  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    const maxButtons = 5;
    let start = Math.max(0, pageNumber - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons);
    start = Math.max(0, end - maxButtons);
    for (let i = start; i < end; i++) nums.push(i);
    return nums;
  }, [pageNumber, totalPages]);

  return (
<<<<<<< HEAD:src/features/user-manager/UserManager.tsx
    <div className="space-y-8 font-google-sans">
      <UserManagementHeader onAddUser={() => setAddUserOpen(true)} />

      <UserStatCards />

      <div>
        <h2 className="mb-4 text-xl md:text-2xl font-semibold text-foreground">{t("User Distribution")}</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UserGenderChart />
          <UserAgeChart />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl md:text-2xl font-semibold text-foreground">{t("Users")}</h2>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <UserFilterToolbar filters={filters} onFiltersChange={handleFiltersChange} />

            {isError ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 py-16 text-center">
                <AlertCircle className="size-8 text-destructive" />
                <p className="text-lg font-semibold text-foreground">{t("Unable to load users.")}</p>
                <p className="text-sm text-muted-foreground font-normal">{t("Please try again.")}</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-2 text-sm font-medium">
                  <RefreshCw className="mr-2 size-3.5" />
                  {t("Retry")}
                </Button>
              </div>
            ) : !isLoading && totalElements === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
                <UsersIcon className="size-8 text-muted-foreground" />
                {hasActiveFilters ? (
                  <>
                    <p className="text-lg font-semibold text-foreground">{t("No users found")}</p>
                    <p className="text-sm text-muted-foreground font-normal">{t("Try changing your search or filters.")}</p>
                    <Button variant="outline" onClick={() => handleFiltersChange(DEFAULT_USER_FILTERS)} className="mt-2 text-sm font-medium">
                      {t("Reset Filters")}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-semibold text-foreground">{t("No users yet")}</p>
                    <p className="text-sm text-muted-foreground font-normal">{t("Create the first user account.")}</p>
                    <Button onClick={() => setAddUserOpen(true)} className="mt-2 bg-[#FFC83D] text-base font-medium text-[#003377] hover:bg-[#f0ba33]">
                      <UserPlus className="mr-2 size-4" />
                      {t("Add User")}
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <UserTable
                  users={users}
                  isLoading={isLoading || isFetching}
                  onViewDetails={handleViewDetails}
                  onSuspend={setSuspendTarget}
                  onReactivate={setReactivateTarget}
                />

                <div className="flex flex-col items-center justify-between gap-4 pt-2 text-base sm:flex-row">
                  <div className="flex items-center gap-3 text-base text-muted-foreground">
                    <span>
                      Showing <span className="font-medium text-foreground">{startItem}</span>–
                      <span className="font-medium text-foreground">{endItem}</span> of{" "}
                      <span className="font-medium text-foreground">{totalElements.toLocaleString()}</span> {t("Users")}
                    </span>
                    <div className="admin-page-size"><Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value));
                        setPageNumber(0);
                      }}
                    >
                      <SelectTrigger className="h-10 w-32 text-sm">
                        <SelectValue value={`${pageSize} / page`} />
                      </SelectTrigger>
                      <SelectContent
                        value={String(pageSize)}
                        onValueChange={(value) => {
                          setPageSize(Number(value));
                          setPageNumber(0);
                        }}
                      >
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                      </SelectContent>
                    </Select></div>
                  </div>

                  {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            disabled={pageNumber === 0}
                            onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
                          />
                        </PaginationItem>
                        {pageNumbers.map((num) => (
                          <PaginationItem key={num}>
                            <PaginationLink isActive={num === pageNumber} onClick={() => setPageNumber(num)}>
                              {num + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            disabled={pageNumber >= totalPages - 1}
                            onClick={() => setPageNumber((p) => Math.min(totalPages - 1, p + 1))}
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
=======
    <div className="w-auto space-y-6 font-google-sans">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#003377] dark:text-white flex items-center gap-3">
              <Users className="size-8 text-[#FFC83D]" />
              {dict.users.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {dict.users.subtitle}: {realUsers.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="inline-flex min-w-[140px] h-[46px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#003377] transition hover:border-[#FFC83D] hover:bg-[#FFC83D] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-[#FFC83D] dark:hover:bg-[#FFC83D] dark:hover:text-[#003377] whitespace-nowrap shrink-0"
            >
              <ChevronLeft size={18} /> {dict.nav.dashboard}
            </button>

            <button
              type="button"
              onClick={() => setOpenCreate(true)}
              className="inline-flex min-w-[150px] h-[46px] items-center justify-center gap-2 rounded-full bg-[#FFC83D] px-5 py-2.5 text-sm font-bold text-[#003377] shadow-sm transition hover:bg-[#f5b91f] dark:bg-[#FFC83D] dark:text-[#003377] whitespace-nowrap shrink-0"
            >
              <Plus size={18} /> {dict.users.addUser}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">{dict.common.loading}</div>
        ) : (
          <UserTable users={realUsers} showSearch initialPageSize={10} />
        )}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/features/users/UserManager.tsx
      </div>

      <AddUserDialog open={addUserOpen} onOpenChange={setAddUserOpen} />

      <UserDetailSheet
        userId={detailUserId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSuspend={setSuspendTarget}
        onReactivate={setReactivateTarget}
      />

      <SuspendUserDialog
        user={suspendTarget}
        open={!!suspendTarget}
        onOpenChange={(open) => !open && setSuspendTarget(null)}
      />
      <ReactivateUserDialog
        user={reactivateTarget}
        open={!!reactivateTarget}
        onOpenChange={(open) => !open && setReactivateTarget(null)}
      />
    </div>
  );
}
