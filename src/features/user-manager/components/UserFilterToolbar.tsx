"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, RotateCcw, Search, X } from "lucide-react";
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
}

export default function UserFilterToolbar({ filters, onFiltersChange }: UserFilterToolbarProps) {
  const [searchInput, setSearchInput] = useState(filters.query);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.query) {
      onFiltersChange({ ...filters, query: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const dateRange: DateRange = {
    from: filters.createdFrom ? new Date(filters.createdFrom) : undefined,
    to: filters.createdTo ? new Date(filters.createdTo) : undefined,
  };

  const hasActiveFilters =
    filters.query.trim() !== "" ||
    filters.accountStatus !== "ALL" ||
    filters.emailVerified !== "ALL" ||
    filters.onboardingCompleted !== "ALL" ||
    !!filters.createdFrom ||
    !!filters.createdTo;

  function handleReset() {
    setSearchInput("");
    onFiltersChange(DEFAULT_USER_FILTERS);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, username, or email..."
            className="h-10 rounded-xl pl-9 text-base"
          />
        </div>

        <Select
          value={filters.accountStatus}
          onValueChange={(value) => onFiltersChange({ ...filters, accountStatus: value })}
        >
          <SelectTrigger className="h-10 w-full rounded-xl text-sm lg:w-[160px]">
            <SelectValue placeholder="Status" value={statusLabel(filters.accountStatus)} />
          </SelectTrigger>
          <SelectContent
            value={filters.accountStatus}
            onValueChange={(value) => onFiltersChange({ ...filters, accountStatus: value })}
          >
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="DELETED">Deleted</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.emailVerified}
          onValueChange={(value) => onFiltersChange({ ...filters, emailVerified: value })}
        >
          <SelectTrigger className="h-10 w-full rounded-xl text-sm lg:w-[160px]">
            <SelectValue placeholder="Verification" value={verifiedLabel(filters.emailVerified)} />
          </SelectTrigger>
          <SelectContent
            value={filters.emailVerified}
            onValueChange={(value) => onFiltersChange({ ...filters, emailVerified: value })}
          >
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="UNVERIFIED">Not Verified</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.onboardingCompleted}
          onValueChange={(value) => onFiltersChange({ ...filters, onboardingCompleted: value })}
        >
          <SelectTrigger className="h-10 w-full rounded-xl text-sm lg:w-[170px]">
            <SelectValue placeholder="Onboarding" value={onboardingLabel(filters.onboardingCompleted)} />
          </SelectTrigger>
          <SelectContent
            value={filters.onboardingCompleted}
            onValueChange={(value) => onFiltersChange({ ...filters, onboardingCompleted: value })}
          >
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="INCOMPLETE">Not Completed</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-input bg-transparent px-3 text-sm text-foreground shadow-sm hover:bg-accent lg:w-[220px]">
            <span className="flex items-center gap-2 truncate">
              <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
                  : format(dateRange.from, "MMM d, yyyy")
                : "Created Date"}
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
          <PopoverContent align="start">
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
          <Button variant="outline" size="sm" onClick={handleReset} className="h-10 rounded-xl">
            <RotateCcw className="mr-1.5 size-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

function statusLabel(value: string) {
  return { ALL: "All Statuses", ACTIVE: "Active", SUSPENDED: "Suspended", DELETED: "Deleted" }[value] ?? value;
}
function verifiedLabel(value: string) {
  return { ALL: "All", VERIFIED: "Verified", UNVERIFIED: "Not Verified" }[value] ?? value;
}
function onboardingLabel(value: string) {
  return { ALL: "All", COMPLETED: "Completed", INCOMPLETE: "Not Completed" }[value] ?? value;
}
