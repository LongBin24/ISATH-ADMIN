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
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarProps {
  mode?: "range" | "single";
  selected?: DateRange | Date;
  onSelect?: (value: DateRange | Date) => void;
  className?: string;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function Calendar({ mode = "range", selected, onSelect, className }: CalendarProps) {
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
    const isRangeEnd = (from && isSameDay(day, from)) || (to && isSameDay(day, to));
    const inRange = !!(from && to && isWithinInterval(day, { start: from, end: to }));
    return { selected: !!isRangeEnd, inRange };
  }

  return (
    <div className={cn("w-[280px]", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-sm font-semibold text-foreground">{format(month, "MMMM yyyy")}</span>
        <button
          type="button"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="text-xs font-medium text-muted-foreground">
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
                "mx-auto flex size-8 items-center justify-center rounded-md text-sm transition-colors",
                outsideMonth && "text-muted-foreground/40",
                !outsideMonth && !isSelected && "text-foreground hover:bg-accent hover:text-accent-foreground",
                inRange && !isSelected && "bg-accent text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground font-semibold",
                isFuture && "cursor-not-allowed opacity-30"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
