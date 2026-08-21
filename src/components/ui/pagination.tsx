"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptionalAdminI18n } from "@/i18n/admin-i18n";

function Pagination({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn(className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

function PaginationLink({
  className,
  isActive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex size-10 items-center justify-center rounded-lg border text-base font-medium shadow-sm transition-colors",
        isActive
          ? "border-[#003377] bg-[#003377] text-white font-bold dark:border-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377]"
          : "border-border bg-background text-foreground hover:border-[#003377] hover:text-[#003377] hover:bg-accent dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D]",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const i18n = useOptionalAdminI18n();
  const t = i18n?.t ?? ((str: string) => str);

  return (
    <button
      type="button"
      aria-label={t("Go to previous page")}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-base font-medium text-foreground shadow-sm transition-colors hover:border-[#003377] hover:text-[#003377] hover:bg-accent dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>{children ?? t("Previous")}</span>
    </button>
  );
}

function PaginationNext({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const i18n = useOptionalAdminI18n();
  const t = i18n?.t ?? ((str: string) => str);

  return (
    <button
      type="button"
      aria-label={t("Go to next page")}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-3.5 text-base font-medium text-foreground shadow-sm transition-colors hover:border-[#003377] hover:text-[#003377] hover:bg-accent dark:hover:border-[#FFC83D] dark:hover:text-[#FFC83D] disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    >
      <span>{children ?? t("Next")}</span>
      <ChevronRight className="size-4" />
    </button>
  );
}

function PaginationEllipsis({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  );
}

interface PaginationSummaryProps {
  start: number;
  end: number;
  total: number;
  entityName?: string;
  className?: string;
}

function PaginationSummary({
  start,
  end,
  total,
  entityName,
  className,
}: PaginationSummaryProps) {
  const i18n = useOptionalAdminI18n();
  const t = i18n?.t ?? ((str: string) => str);

  if (total <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-base font-normal text-muted-foreground",
        className
      )}
    >
      <span>{t("Showing")}</span>
      <span className="font-semibold text-foreground">
        {start}–{end}
      </span>
      <span>{t("of")}</span>
      <span className="font-semibold text-foreground">
        {total.toLocaleString()}
      </span>
      {entityName && <span>{entityName}</span>}
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationSummary,
};
