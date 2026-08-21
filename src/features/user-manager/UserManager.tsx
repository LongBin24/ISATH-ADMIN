"use client";

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
            <UserFilterToolbar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={() => handleFiltersChange(DEFAULT_USER_FILTERS)}
            />

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
