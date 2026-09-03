"use client";

import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Mail,
  Phone,
  UserCheck,
  UserX,
  MoreHorizontal,
  MessageSquareOff,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminI18n } from "@/i18n/admin-i18n";
import type { ContactMessage } from "../types";

interface ContactUsTableProps {
  messages: ContactMessage[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  onSelectMessage: (message: ContactMessage) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr: string, exact = false): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return exact ? format(d, "PPp") : formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function ContactUsTable({
  messages,
  isLoading,
  totalElements,
  totalPages,
  page,
  size,
  onPageChange,
  onSizeChange,
  onSelectMessage,
  onResetFilters,
  hasActiveFilters = false,
}: ContactUsTableProps) {
  const { t } = useAdminI18n();

  const start = totalElements ? page * size + 1 : 0;
  const end = Math.min((page + 1) * size, totalElements);

  const pageNumbers = useMemo(() => {
    const startNum = Math.max(0, Math.min(page - 2, totalPages - 5));
    return Array.from(
      { length: Math.min(5, totalPages) },
      (_, index) => startNum + index
    );
  }, [page, totalPages]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
        <Skeleton className="mb-4 h-12 w-full rounded-xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="mb-3 h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <MessageSquareOff className="size-7" />
        </span>
        <h3 className="text-lg font-bold text-[#003377] dark:text-[#FFC83D]">
          {hasActiveFilters ? t("No messages found") : t("No contact messages yet")}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {hasActiveFilters
            ? t("No contact messages match the current search or filter criteria.")
            : t("Incoming messages from website visitors and users will appear here.")}
        </p>
        {hasActiveFilters && onResetFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="mt-4 h-10 rounded-xl px-4 text-sm font-semibold"
          >
            {t("Reset Filters")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 font-google-sans">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 dark:bg-slate-800/60">
              <TableRow className="border-slate-200/80 hover:bg-transparent dark:border-slate-800">
                <TableHead className="min-w-60 text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Sender")}
                </TableHead>
                <TableHead className="min-w-36 text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("User Type")}
                </TableHead>
                <TableHead className="min-w-36 text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Phone")}
                </TableHead>
                <TableHead className="min-w-72 text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Subject & Message")}
                </TableHead>
                <TableHead className="min-w-40 text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Received")}
                </TableHead>
                <TableHead className="w-16 text-right text-sm font-bold text-[#003377] dark:text-[#FFC83D]">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => onSelectMessage(item)}
                  className="cursor-pointer border-slate-200/60 transition hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                >
                  {/* Sender Info */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9.5 border border-slate-200 bg-[#003377]/10 font-bold text-[#003377] dark:border-slate-700 dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]">
                        <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {item.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Account Type Badge */}
                  <TableCell className="py-4">
                    {item.registeredUser ? (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-lg border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                      >
                        <UserCheck className="size-3.5" />
                        {t("Registered User")}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-lg border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        <UserX className="size-3.5" />
                        {t("Guest")}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                    {item.phone ? (
                      <a
                        href={`tel:${item.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 hover:text-[#003377] hover:underline dark:hover:text-[#FFC83D]"
                      >
                        <Phone className="size-3 text-slate-400" />
                        <span>{item.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </TableCell>

                  {/* Subject & Preview */}
                  <TableCell className="py-4">
                    <p className="max-w-xs truncate text-sm font-semibold text-slate-900 dark:text-slate-100 sm:max-w-md">
                      {item.subject}
                    </p>
                    <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500 dark:text-slate-400 sm:max-w-md">
                      {item.messagePreview}
                    </p>
                  </TableCell>

                  {/* Received Date */}
                  <TableCell className="py-4 text-xs text-slate-500 dark:text-slate-400">
                    <Tooltip>
                      <TooltipTrigger className="cursor-default text-left">
                        {formatDate(item.createdAt)}
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDate(item.createdAt, true)}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Actions Button -> Opens Popup Modal directly */}
                  <TableCell
                    className="py-4 text-right"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMessage(item);
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectMessage(item)}
                          className="size-8.5 rounded-xl border border-slate-200/80 bg-transparent text-slate-600 shadow-2xs transition hover:border-[#003377] hover:bg-transparent hover:text-[#003377] dark:border-slate-800 dark:bg-transparent dark:text-slate-300 dark:hover:border-[#FFC83D] dark:hover:bg-transparent dark:hover:text-[#FFC83D]"
                          aria-label={t("View Details")}
                        >
                          <MoreHorizontal className="size-4.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t("View Details")}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-4 text-sm sm:flex-row dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400">
          <PaginationSummary
            start={start}
            end={end}
            total={totalElements}
            entityName={t("messages")}
          />
          <div className="flex items-center gap-2">
            <Select
              value={String(size)}
              onValueChange={(val) => {
                onSizeChange(Number(val));
                onPageChange(0);
              }}
            >
              <SelectTrigger className="h-9 w-28 rounded-xl border-slate-200 text-xs dark:border-slate-800">
                <SelectValue placeholder={`${size} / page`} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="5">5 / {t("page")}</SelectItem>
                <SelectItem value="10">10 / {t("page")}</SelectItem>
                <SelectItem value="20">20 / {t("page")}</SelectItem>
                <SelectItem value="50">50 / {t("page")}</SelectItem>
                <SelectItem value="100">100 / {t("page")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={page === 0}
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                />
              </PaginationItem>
              {pageNumbers.map((num) => (
                <PaginationItem key={num}>
                  <PaginationLink
                    isActive={num === page}
                    onClick={() => onPageChange(num)}
                  >
                    {num + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  disabled={page + 1 >= totalPages}
                  onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
