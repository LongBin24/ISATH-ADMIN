"use client";

import * as React from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  addMonths,
  subMonths,
  isAfter,
  isBefore,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { Button } from "@/components/ui/button";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarProps {
  mode?: "range" | "single";
  selected?: DateRange | Date;
  onSelect?: (value: DateRange | Date) => void;
  className?: string;
  showPresets?: boolean;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({
  mode = "range",
  selected,
  onSelect,
  className,
  showPresets = true,
}: CalendarProps) {
  const { t } = useAdminI18n();
  const range = mode === "range" ? (selected as DateRange | undefined) : undefined;
  const single = mode === "single" ? (selected as Date | undefined) : undefined;
  const [month, setMonth] = React.useState(() => range?.from ?? single ?? new Date());

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  function handleDayClick(day: Date) {
    if (mode === "single") {
      onSelect?.(day);
      return;
    }
    const current = range ?? {};
    if (!current.from || (current.from && current.to)) {
      onSelect?.({ from: day, to: undefined });
      return;
    }
    if (isBefore(day, current.from)) {
      onSelect?.({ from: day, to: current.from });
    } else {
      onSelect?.({ from: current.from, to: day });
    }
  }

  function dayState(day: Date) {
    if (mode === "single") {
      return { selected: single ? isSameDay(day, single) : false, inRange: false };
    }
    const { from, to } = range ?? {};
    const isRangeStart = from && isSameDay(day, from);
    const isRangeEnd = to && isSameDay(day, to);
    const inRange = Boolean(from && to && isWithinInterval(day, { start: from, end: to }));
    return { selected: Boolean(isRangeStart || isRangeEnd), inRange };
  }

  function handlePreset(daysAgo: number) {
    const today = endOfDay(new Date());
    const from = startOfDay(subDays(today, daysAgo));
    setMonth(from);
    onSelect?.({ from, to: today });
  }

  function handleToday() {
    const today = new Date();
    setMonth(today);
    if (mode === "single") {
      onSelect?.(today);
    } else {
      onSelect?.({ from: startOfDay(today), to: endOfDay(today) });
    }
  }

  return (
    <div className={cn("w-[280px] font-google-sans p-1", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-[#003377]/10 hover:text-[#003377] active:scale-95 dark:hover:bg-[#FFC83D]/20 dark:hover:text-[#FFC83D]"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-[#003377] dark:text-[#FFC83D]">
          {format(month, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="flex size-8 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-[#003377]/10 hover:text-[#003377] active:scale-95 dark:hover:bg-[#FFC83D]/20 dark:hover:text-[#FFC83D]"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="py-1 text-xs font-semibold text-muted-foreground uppercase">
            {label}
          </span>
        ))}

        {days.map((day) => {
          const { selected: isSelected, inRange } = dayState(day);
          const outsideMonth = !isSameMonth(day, month);
          const isFuture = isAfter(day, new Date());

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isFuture}
              onClick={() => handleDayClick(day)}
              className={cn(
                "mx-auto flex size-8 items-center justify-center rounded-xl text-xs font-medium transition-all duration-150",
                outsideMonth && "text-muted-foreground/30",
                !outsideMonth && !isSelected && !inRange && "text-foreground hover:bg-[#003377]/10 hover:text-[#003377] dark:hover:bg-[#FFC83D]/20 dark:hover:text-[#FFC83D]",
                inRange && !isSelected && "bg-[#003377]/10 text-[#003377] font-semibold dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]",
                isSelected && "bg-[#003377] text-white font-bold shadow-sm active:scale-95 dark:bg-[#FFC83D] dark:text-[#003377]",
                isFuture && "cursor-not-allowed opacity-20 hover:bg-transparent"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {showPresets && mode === "range" && (
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="h-7 rounded-lg px-2 text-[11px] font-medium text-[#003377] hover:bg-[#003377]/10 dark:text-[#FFC83D] dark:hover:bg-[#FFC83D]/20"
          >
            {t("Today")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handlePreset(7)}
            className="h-7 rounded-lg px-2 text-[11px] font-medium text-[#003377] hover:bg-[#003377]/10 dark:text-[#FFC83D] dark:hover:bg-[#FFC83D]/20"
          >
            7 {t("Days") || "Days"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handlePreset(30)}
            className="h-7 rounded-lg px-2 text-[11px] font-medium text-[#003377] hover:bg-[#003377]/10 dark:text-[#FFC83D] dark:hover:bg-[#FFC83D]/20"
          >
            30 {t("Days") || "Days"}
          </Button>
        </div>
      )}
    </div>
  );
}
