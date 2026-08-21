"use client";

import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AdminUser } from "@/features/user-manager/types";
import {
  ADMIN_NOTIFICATION_TYPES,
  ADMIN_REFERENCE_TYPES,
  type AdminNotificationType,
  type AdminReferenceType,
} from "../types";
import { notificationTypeLabel, referenceTypeLabel } from "../presentation";
import NotificationUserSelector from "./NotificationUserSelector";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { cn } from "@/lib/utils";

export interface NotificationFilters {
  search?: string;
  user: AdminUser | null;
  notificationType: AdminNotificationType | "ALL";
  referenceType: AdminReferenceType | "ALL";
  read: "ALL" | "READ" | "UNREAD";
  createdFrom?: string;
  createdTo?: string;
}

export const DEFAULT_NOTIFICATION_FILTERS: NotificationFilters = {
  search: "",
  user: null,
  notificationType: "ALL",
  referenceType: "ALL",
  read: "ALL",
};

export default function NotificationFilterToolbar({
  filters,
  onChange,
  onReset,
}: {
  filters: NotificationFilters;
  onChange: (filters: NotificationFilters) => void;
  onReset: () => void;
}) {
  const { t } = useAdminI18n();
  const dateRange: DateRange = {
    from: filters.createdFrom ? new Date(filters.createdFrom) : undefined,
    to: filters.createdTo ? new Date(filters.createdTo) : undefined,
  };
  const hasFilters =
    Boolean(filters.search?.trim()) ||
    !!filters.user ||
    filters.notificationType !== "ALL" ||
    filters.referenceType !== "ALL" ||
    filters.read !== "ALL" ||
    !!filters.createdFrom ||
    !!filters.createdTo;

  return (
    <div className="flex flex-col gap-2.5 xl:flex-row xl:items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search ?? ""}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder={t("Search by title, message, or user...")}
          className="h-11 rounded-xl pl-9 pr-8 text-sm"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <NotificationUserSelector
          value={filters.user}
          onChange={(user) => onChange({ ...filters, user })}
          placeholder={t("All recipients")}
        />

        <Select
          value={filters.notificationType}
          onValueChange={(value) => onChange({ ...filters, notificationType: value as NotificationFilters["notificationType"] })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[130px] rounded-xl text-sm font-medium transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.notificationType !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Type")} value={filters.notificationType === "ALL" ? t("All types") : t(notificationTypeLabel(filters.notificationType))} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">{t("All types")}</SelectItem>
            {ADMIN_NOTIFICATION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>{t(notificationTypeLabel(type))}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.referenceType}
          onValueChange={(value) => onChange({ ...filters, referenceType: value as NotificationFilters["referenceType"] })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[130px] rounded-xl text-sm font-medium transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.referenceType !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Reference")} value={filters.referenceType === "ALL" ? t("All references") : t(referenceTypeLabel(filters.referenceType))} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">{t("All references")}</SelectItem>
            {ADMIN_REFERENCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>{t(referenceTypeLabel(type))}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.read}
          onValueChange={(value) => onChange({ ...filters, read: value as NotificationFilters["read"] })}
        >
          <SelectTrigger
            className={cn(
              "h-11 min-w-[120px] rounded-xl text-sm font-medium transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
              filters.read !== "ALL" && "border-[#003377] text-[#003377] font-semibold dark:border-[#FFC83D] dark:text-[#FFC83D]"
            )}
          >
            <SelectValue placeholder={t("Status")} value={{ ALL: t("All read statuses"), READ: t("Read"), UNREAD: t("Unread") }[filters.read]} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">{t("All read statuses")}</SelectItem>
            <SelectItem value="READ">{t("Read")}</SelectItem>
            <SelectItem value="UNREAD">{t("Unread")}</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger
            className={cn(
              "flex h-11 min-w-[160px] items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-sm font-medium shadow-sm transition hover:border-[#003377] dark:hover:border-[#FFC83D]",
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
                onClick={(event) => {
                  event.stopPropagation();
                  onChange({ ...filters, createdFrom: undefined, createdTo: undefined });
                }}
              />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="rounded-2xl p-3">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(selection) => {
                const range = selection as DateRange;
                onChange({
                  ...filters,
                  createdFrom: range.from ? `${format(range.from, "yyyy-MM-dd")}T00:00:00Z` : undefined,
                  createdTo: range.to ? `${format(range.to, "yyyy-MM-dd")}T23:59:59Z` : undefined,
                });
              }}
            />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            className="h-11 shrink-0 rounded-xl px-3 text-sm font-medium"
            onClick={onReset}
          >
            {t("Reset")}
          </Button>
        )}
      </div>
    </div>
  );
}
