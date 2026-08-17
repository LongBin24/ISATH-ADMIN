"use client";

import { format } from "date-fns";
import { CalendarIcon, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
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

export interface NotificationFilters {
  user: AdminUser | null;
  notificationType: AdminNotificationType | "ALL";
  referenceType: AdminReferenceType | "ALL";
  read: "ALL" | "READ" | "UNREAD";
  createdFrom?: string;
  createdTo?: string;
}

export const DEFAULT_NOTIFICATION_FILTERS: NotificationFilters = {
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
    !!filters.user ||
    filters.notificationType !== "ALL" ||
    filters.referenceType !== "ALL" ||
    filters.read !== "ALL" ||
    !!filters.createdFrom ||
    !!filters.createdTo;

  return (
    <div className="filter-card grid gap-3 text-base md:grid-cols-2 xl:grid-cols-[minmax(220px,1.35fr)_repeat(3,minmax(150px,0.8fr))_minmax(210px,1fr)_auto]">
      <NotificationUserSelector
        value={filters.user}
        onChange={(user) => onChange({ ...filters, user })}
        placeholder={t("All recipients")}
      />

      <Select
        value={filters.notificationType}
        onValueChange={(value) => onChange({ ...filters, notificationType: value as NotificationFilters["notificationType"] })}
      >
        <SelectTrigger className="h-11 rounded-xl text-base">
          <SelectValue value={filters.notificationType === "ALL" ? t("All types") : t(notificationTypeLabel(filters.notificationType))} />
        </SelectTrigger>
        <SelectContent value={filters.notificationType} onValueChange={(value) => onChange({ ...filters, notificationType: value as NotificationFilters["notificationType"] })}>
          <SelectItem value="ALL">{t("All types")}</SelectItem>
          {ADMIN_NOTIFICATION_TYPES.map((type) => <SelectItem key={type} value={type}>{t(notificationTypeLabel(type))}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select
        value={filters.referenceType}
        onValueChange={(value) => onChange({ ...filters, referenceType: value as NotificationFilters["referenceType"] })}
      >
        <SelectTrigger className="h-11 rounded-xl text-base">
          <SelectValue value={filters.referenceType === "ALL" ? t("All references") : t(referenceTypeLabel(filters.referenceType))} />
        </SelectTrigger>
        <SelectContent value={filters.referenceType} onValueChange={(value) => onChange({ ...filters, referenceType: value as NotificationFilters["referenceType"] })}>
          <SelectItem value="ALL">{t("All references")}</SelectItem>
          {ADMIN_REFERENCE_TYPES.map((type) => <SelectItem key={type} value={type}>{t(referenceTypeLabel(type))}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={filters.read} onValueChange={(value) => onChange({ ...filters, read: value as NotificationFilters["read"] })}>
        <SelectTrigger className="h-11 rounded-xl text-base">
          <SelectValue value={{ ALL: t("All read statuses"), READ: t("Read"), UNREAD: t("Unread") }[filters.read]} />
        </SelectTrigger>
        <SelectContent value={filters.read} onValueChange={(value) => onChange({ ...filters, read: value as NotificationFilters["read"] })}>
          <SelectItem value="ALL">{t("All read statuses")}</SelectItem>
          <SelectItem value="READ">{t("Read")}</SelectItem>
          <SelectItem value="UNREAD">{t("Unread")}</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-input bg-background px-3 text-base shadow-sm">
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
              className="size-4 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation();
                onChange({ ...filters, createdFrom: undefined, createdTo: undefined });
              }}
            />
          )}
        </PopoverTrigger>
        <PopoverContent align="start">
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

      <Button type="button" variant="outline" className="h-11 rounded-xl text-base font-medium" disabled={!hasFilters} onClick={onReset}>
        <RotateCcw className="mr-2 size-4" />
        {t("Reset")}
      </Button>
    </div>
  );
}
