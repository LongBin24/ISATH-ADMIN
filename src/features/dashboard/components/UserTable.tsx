"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "@/features/dashboard/components/ui/badge";
import {
  Eye,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import UserDetailModal from "./UserDetailModal";
import Image from "next/image";
import { useSuspendUserMutation, useReactivateUserMutation } from "@/features/user-manager/api";
import toast from "react-hot-toast";

interface UserTableProps {
  users: any[];
  showSearch?: boolean;
  initialPageSize?: number;
}

export default function UserTable({ users, showSearch = true, initialPageSize = 10 }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [accountStatusFilter, setAccountStatusFilter] = useState<string>("ALL");
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<string>("ALL");
  const [onboardingFilter, setOnboardingFilter] = useState<string>("ALL");

  const [suspendUser] = useSuspendUserMutation();
  const [reactivateUser] = useReactivateUserMutation();

  function openUser(user: any) {
    setSelectedUser(user);
    setOpenDetail(true);
  }

  const handleToggleSuspend = async (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    const userId = user.id || user.rawUser?.id;
    const isSuspended = user.status === "suspended" || user.rawUser?.accountStatus === "SUSPENDED";

    try {
      if (isSuspended) {
        await reactivateUser(userId).unwrap();
        toast.success(`បានបើកដំណើរការ ${user.name} ឡើងវិញជោគជ័យ`);
      } else {
        await suspendUser(userId).unwrap();
        toast.success(`បានផ្អាកដំណើរការ ${user.name} ជោគជ័យ`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setAccountStatusFilter("ALL");
    setEmailVerifiedFilter("ALL");
    setOnboardingFilter("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    accountStatusFilter !== "ALL" ||
    emailVerifiedFilter !== "ALL" ||
    onboardingFilter !== "ALL";

  // Multi-field Filtered Users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => {
        const name = (u.name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const id = (u.id || "").toLowerCase();
        return name.includes(q) || email.includes(q) || id.includes(q);
      });
    }

    // 2. accountStatus Filter (ACTIVE, SUSPENDED, DELETED)
    if (accountStatusFilter !== "ALL") {
      result = result.filter((u) => {
        const status = u.rawUser?.accountStatus || (u.status === "suspended" ? "SUSPENDED" : "ACTIVE");
        return status.toUpperCase() === accountStatusFilter.toUpperCase();
      });
    }

    // 3. emailVerified Filter
    if (emailVerifiedFilter !== "ALL") {
      const targetVerified = emailVerifiedFilter === "VERIFIED";
      result = result.filter((u) => {
        const isVerified = u.rawUser?.emailVerified ?? true;
        return isVerified === targetVerified;
      });
    }

    // 4. onboardingCompleted Filter
    if (onboardingFilter !== "ALL") {
      const targetCompleted = onboardingFilter === "COMPLETED";
      result = result.filter((u) => {
        const isCompleted = u.rawUser?.onboardingCompleted ?? true;
        return isCompleted === targetCompleted;
      });
    }

    return result;
  }, [
    users,
    searchQuery,
    accountStatusFilter,
    emailVerifiedFilter,
    onboardingFilter,
  ]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  return (
    <div className="space-y-4 font-google-sans">
      {/* Top Search & Filter Toggle Bar */}
      {showSearch && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="ស្វែងរកតាម ឈ្មោះ អ៊ីម៉ែល ឬ លេខសម្គាល់..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition ${
                  showFilters || hasActiveFilters
                    ? "border-[#003377] bg-[#003377] text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                <Filter className="size-4" />
                <span>តម្រងស្វែងរក</span>
                {hasActiveFilters && (
                  <span className="size-2 rounded-full bg-[#FFC83D]" />
                )}
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="លុបតម្រង"
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <RotateCcw className="size-3.5" />
                  <span>លុបតម្រង</span>
                </button>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 ml-2">
                <span>បង្ហាញ:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value={5}>5 នាក់</option>
                  <option value={10}>10 នាក់</option>
                  <option value={20}>20 នាក់</option>
                  <option value={50}>50 នាក់</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expandable Query Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              {/* accountStatus */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  ស្ថានភាពគណនី
                </label>
                <select
                  value={accountStatusFilter}
                  onChange={(e) => {
                    setAccountStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">ទាំងអស់</option>
                  <option value="ACTIVE">សកម្ម</option>
                  <option value="SUSPENDED">ផ្អាកដំណើរការ</option>
                  <option value="DELETED">បានលុប</option>
                </select>
              </div>

              {/* onboardingCompleted */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  ការចុះឈ្មោះប្រើប្រាស់
                </label>
                <select
                  value={onboardingFilter}
                  onChange={(e) => {
                    setOnboardingFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">ទាំងអស់</option>
                  <option value="COMPLETED">រួចរាល់</option>
                  <option value="PENDING">មិនទាន់រួចរាល់</option>
                </select>
              </div>

              {/* emailVerified */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  ការផ្ទៀងផ្ទាត់អ៊ីម៉ែល
                </label>
                <select
                  value={emailVerifiedFilter}
                  onChange={(e) => {
                    setEmailVerifiedFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="ALL">ទាំងអស់</option>
                  <option value="VERIFIED">ផ្ទៀងផ្ទាត់រួចរាល់</option>
                  <option value="UNVERIFIED">មិនទាន់ផ្ទៀងផ្ទាត់</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Table */}
      <Table className="font-google-sans">
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead>អ្នកប្រើប្រាស់</TableHead>
            <TableHead>ស្ថានភាព</TableHead>
            <TableHead>ការចុះឈ្មោះ និង ផ្ទៀងផ្ទាត់</TableHead>
            <TableHead>កាលបរិច្ឆេទបង្កើត</TableHead>
            <TableHead className="text-right">សកម្មភាព</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                មិនមានទិន្នន័យអ្នកប្រើប្រាស់តាមតម្រងស្វែងរកទេ
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => {
              const avatarUrl = user.avatarUrl || user.rawUser?.profileImageUrl;
              const accountStatus = (user.rawUser?.accountStatus || (user.status === "suspended" ? "SUSPENDED" : "ACTIVE")).toUpperCase();
              const isSuspended = accountStatus === "SUSPENDED";
              const isDeleted = accountStatus === "DELETED";
              const isVerified = user.rawUser?.emailVerified ?? true;
              const isOnboarded = user.rawUser?.onboardingCompleted ?? true;

              const dateStr = user.rawUser?.createdAt
                ? new Date(user.rawUser.createdAt).toLocaleDateString("km-KH")
                : user.lastActive || "—";

              return (
                <TableRow
                  key={user.id}
                  onClick={() => openUser(user)}
                  className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <TableCell className="flex items-center gap-3">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        unoptimized
                        className="size-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-[#003377] text-white flex items-center justify-center font-bold">
                        {user.name?.[0] ?? "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 font-google-sans">
                        {user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        isSuspended
                          ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                          : isDeleted
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
                      }
                    >
                      {isSuspended ? "ផ្អាកដំណើរការ" : isDeleted ? "បានលុប" : "សកម្ម"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-col gap-1">
                      <span className={isOnboarded ? "text-emerald-600 font-medium flex items-center gap-1" : "text-amber-600 font-medium flex items-center gap-1"}>
                        {isOnboarded ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                        ការចុះឈ្មោះ: {isOnboarded ? "រួចរាល់" : "មិនទាន់រួចរាល់"}
                      </span>
                      <span className={isVerified ? "text-slate-500" : "text-amber-600"}>
                        អ៊ីម៉ែល: {isVerified ? "បានផ្ទៀងផ្ទាត់" : "មិនទាន់ផ្ទៀងផ្ទាត់"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {dateStr}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openUser(user);
                      }}
                      title="មើលព័ត៌មានលម្អិត"
                      className="p-1 text-slate-400 hover:text-[#003377]"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={(e) => handleToggleSuspend(e, user)}
                      title={isSuspended ? "បើកដំណើរការឡើងវិញ" : "ផ្អាកដំណើរការ"}
                      className={`p-1 ${
                        isSuspended
                          ? "text-emerald-500 hover:text-emerald-700"
                          : "text-red-400 hover:text-red-600"
                      }`}
                    >
                      {isSuspended ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            បង្ហាញ <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}</span> ដល់{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{endItem}</span> នៃ{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> អ្នកប្រើប្រាស់
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <ChevronLeft className="size-4" /> ថយក្រោយ
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`size-8 rounded-xl text-xs font-semibold transition ${
                    safeCurrentPage === page
                      ? "bg-[#003377] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              បន្ទាប់ <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <UserDetailModal open={openDetail} onOpenChange={setOpenDetail} user={selectedUser} />
    </div>
  );
}
