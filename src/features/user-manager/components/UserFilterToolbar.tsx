
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { useDebounce } from "@/hooks/use-debounce";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";

export interface UserFilters {
  query: string;
  accountStatus: string;
  emailVerified: string;
  onboardingCompleted: string;
  createdFrom?: string;
  createdTo?: string;
}

export const DEFAULT_USER_FILTERS: UserFilters = {
  query: "",
  accountStatus: "ALL",
  emailVerified: "ALL",
  onboardingCompleted: "ALL",
  createdFrom: undefined,
  createdTo: undefined,
};

interface UserFilterToolbarProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  onReset?: () => void;
}

export default function UserFilterToolbar({
  filters,
  onFiltersChange,
  onReset,
}: UserFilterToolbarProps) {
  const { t } = useAdminI18n();
  const [searchInput, setSearchInput] = useState(filters.query);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.query) {
      onFiltersChange({ ...filters, query: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const hasActiveFilters =
    Boolean(searchInput.trim()) ||
    filters.accountStatus !== "ALL" ||
    filters.emailVerified !== "ALL" ||
    filters.onboardingCompleted !== "ALL" ||
    Boolean(filters.createdFrom) ||
    Boolean(filters.createdTo);

  const handleReset = () => {
    setSearchInput("");
    if (onReset) {
      onReset();
    } else {
      onFiltersChange(DEFAULT_USER_FILTERS);
    }
  };

  const dateRange: DateRange = {
    from: filters.createdFrom ? new Date(filters.createdFrom) : undefined,
    to: filters.createdTo ? new Date(filters.createdTo) : undefined,
  };

  function statusLabel(value: string) {
    const raw = { ALL: "All Statuses", ACTIVE: "Active", SUSPENDED: "Suspended", DELETED: "Deleted" }[value] ?? value;
    return t(raw);
  }
  function verifiedLabel(value: string) {
    const raw = { ALL: "All", VERIFIED: "Verified", UNVERIFIED: "Not Verified" }[value] ?? value;
    return t(raw);
  }
  function onboardingLabel(value: string) {
    const raw = { ALL: "All", COMPLETED: "Completed", INCOMPLETE: "Not Completed" }[value] ?? value;
    return t(raw);
  }

  return (
    <div
      className={cn(
        "grid gap-2 md:grid-cols-2 xl:items-center",
        hasActiveFilters
          ? "xl:grid-cols-[minmax(240px,3.5fr)_repeat(5,minmax(130px,1fr))]"
          : "xl:grid-cols-[minmax(280px,4.5fr)_repeat(4,minmax(130px,1fr))]",
      )}
    >
      <div className="relative md:col-span-2 xl:col-span-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t("Search user...")}
          className="h-11 rounded-xl bg-background pl-10 pr-9 text-sm shadow-sm focus-visible:border-[#003377] dark:focus-visible:border-[#FFC83D]"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              onFiltersChange({ ...filters, query: "" });
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:col-span-2 xl:contents">
        <Select
          value={filters.accountStatus}
          onValueChange={(value) => onFiltersChange({ ...filters, accountStatus: value })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[140px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.accountStatus !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Status")} value={statusLabel(filters.accountStatus)} />
          </SelectTrigger>
          <SelectContent
            value={filters.accountStatus}
            onValueChange={(value) => onFiltersChange({ ...filters, accountStatus: value })}
            className="rounded-xl"
          >
            <SelectItem value="ALL">{t("All Statuses")}</SelectItem>
            <SelectItem value="ACTIVE">{t("Active")}</SelectItem>
            <SelectItem value="SUSPENDED">{t("Suspended")}</SelectItem>
            <SelectItem value="DELETED">{t("Deleted")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.emailVerified}
          onValueChange={(value) => onFiltersChange({ ...filters, emailVerified: value })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[130px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.emailVerified !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Verification")} value={verifiedLabel(filters.emailVerified)} />
          </SelectTrigger>
          <SelectContent
            value={filters.emailVerified}
            onValueChange={(value) => onFiltersChange({ ...filters, emailVerified: value })}
            className="rounded-xl"
          >
            <SelectItem value="ALL">{t("All")}</SelectItem>
            <SelectItem value="VERIFIED">{t("Verified")}</SelectItem>
            <SelectItem value="UNVERIFIED">{t("Not Verified")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.onboardingCompleted}
          onValueChange={(value) => onFiltersChange({ ...filters, onboardingCompleted: value })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[130px] rounded-xl bg-muted/60 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.onboardingCompleted !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Onboarding")} value={onboardingLabel(filters.onboardingCompleted)} />
          </SelectTrigger>
          <SelectContent
            value={filters.onboardingCompleted}
            onValueChange={(value) => onFiltersChange({ ...filters, onboardingCompleted: value })}
            className="rounded-xl"
          >
            <SelectItem value="ALL">{t("All")}</SelectItem>
            <SelectItem value="COMPLETED">{t("Completed")}</SelectItem>
            <SelectItem value="INCOMPLETE">{t("Not Completed")}</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger
            className={cn(
              "flex h-11 w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border border-input bg-muted/60 px-3 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              (dateRange.from || dateRange.to) && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
                  : format(dateRange.from, "MMM d, yyyy")
                : t("Created Date")}
            </span>
            {(dateRange.from || dateRange.to) && (
              <X
                className="size-3.5 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onFiltersChange({ ...filters, createdFrom: undefined, createdTo: undefined });
                }}
              />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-2xl p-3">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(value) => {
                const range = value as DateRange;
                onFiltersChange({
                  ...filters,
                  createdFrom: range.from ? `${format(range.from, "yyyy-MM-dd")}T00:00:00Z` : undefined,
                  createdTo: range.to ? `${format(range.to, "yyyy-MM-dd")}T23:59:59Z` : undefined,
                });
              }}
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            className="h-11 w-full shrink-0 rounded-xl bg-muted/60 px-3 text-sm font-medium shadow-sm"
            onClick={handleReset}
          >
            {t("Reset")}
          </Button>
        )}
      </div>
    </div>
  );
}
