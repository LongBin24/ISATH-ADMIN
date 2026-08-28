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
        "flex size-10 items-center justify-center rounded-xl border text-base font-medium shadow-2xs transition-colors",
        isActive
          ? "border-[#003377] bg-[#003377] text-white font-bold dark:border-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377]"
          : "border-slate-200/80 bg-transparent text-slate-600 hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]",
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
        "flex h-10 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-transparent px-3.5 text-base font-medium text-slate-600 shadow-2xs transition-colors hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D] disabled:pointer-events-none disabled:opacity-40",
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
        "flex h-10 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-transparent px-3.5 text-base font-medium text-slate-600 shadow-2xs transition-colors hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D] disabled:pointer-events-none disabled:opacity-40",
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
      className={cn("flex size-9 items-center justify-center rounded-xl border border-transparent text-muted-foreground transition hover:border-slate-300 hover:bg-transparent dark:hover:border-slate-700 dark:hover:bg-transparent", className)}
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
