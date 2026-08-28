"use client";

import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { UserTypeFilter, ContactSortOption } from "../types";

interface ContactUsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  userType: UserTypeFilter;
  onUserTypeChange: (value: UserTypeFilter) => void;
  sortBy: ContactSortOption;
  onSortByChange: (value: ContactSortOption) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function ContactUsFilters({
  search,
  onSearchChange,
  userType,
  onUserTypeChange,
  sortBy,
  onSortByChange,
  onReset,
  hasActiveFilters,
}: ContactUsFiltersProps) {
  const { t } = useAdminI18n();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between font-google-sans">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("Search user...")}
          className="h-11 w-full rounded-xl border-slate-200/80 bg-white/80 pl-10 pr-9 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-[#003377] focus:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#FFC83D]"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label={t("Clear search")}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* User Type Filter */}
        <Select
          value={userType}
          onValueChange={(val) => onUserTypeChange(val as UserTypeFilter)}
        >
          <SelectTrigger className="h-11 min-w-[150px] rounded-xl border-slate-200/80 bg-white/80 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-[#FFC83D]">
            <SelectValue placeholder={t("User Type")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">{t("All User Types")}</SelectItem>
            <SelectItem value="REGISTERED">{t("Registered Users")}</SelectItem>
            <SelectItem value="GUEST">{t("Guest Inquiries")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select
          value={sortBy}
          onValueChange={(val) => onSortByChange(val as ContactSortOption)}
        >
          <SelectTrigger className="h-11 min-w-[150px] rounded-xl border-slate-200/80 bg-white/80 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-[#FFC83D]">
            <SelectValue placeholder={t("Sort By")} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="NEWEST">{t("Newest First")}</SelectItem>
            <SelectItem value="OLDEST">{t("Oldest First")}</SelectItem>
            <SelectItem value="NAME">{t("Sender Name")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="h-11 gap-1.5 rounded-xl px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RotateCcw className="size-3.5" />
            {t("Reset Filters")}
          </Button>
        )}
      </div>
    </div>
  );
}
