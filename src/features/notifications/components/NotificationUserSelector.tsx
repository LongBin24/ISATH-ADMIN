"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetAdminUsersQuery } from "@/features/user-manager/api";
import type { AdminUser } from "@/features/user-manager/types";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface NotificationUserSelectorProps {
  value: AdminUser | null;
  onChange: (user: AdminUser | null) => void;
  allowClear?: boolean;
  placeholder?: string;
}

function userName(user: AdminUser) {
  return user.displayName || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || user.email;
}

export default function NotificationUserSelector({
  value,
  onChange,
  allowClear = true,
  placeholder = "Select a user",
}: NotificationUserSelectorProps) {
  const { t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const { data, isLoading, isFetching, isError } = useGetAdminUsersQuery({
    pageNumber: 0,
    pageSize: 10,
    query: debouncedQuery || undefined,
  });
  const users = data?.content ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-input bg-background px-3 text-left text-base shadow-sm">
        <span className="min-w-0 flex-1 truncate">
          {value ? (
            <span className="flex min-w-0 items-center gap-2">
              <Avatar className="size-7">
                <AvatarImage src={value.profileImageUrl ?? undefined} alt={userName(value)} />
                <AvatarFallback className="text-xs">{userName(value).charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="truncate text-base">{userName(value)}</span>
            </span>
          ) : (
            <span className="text-base text-muted-foreground">{t(placeholder)}</span>
          )}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[min(24rem,calc(100vw-2rem))] p-2 text-base">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("Search by name, username, or email...")}
            className="h-10 pl-9 text-base"
            autoFocus
          />
        </div>

        <div className="mt-2 max-h-72 space-y-1 overflow-y-auto">
          {allowClear && value && (
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-3 py-2.5 text-base"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              <X className="size-4" />
              {t("Clear selection")}
            </Button>
          )}

          {isLoading || isFetching ? (
            Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)
          ) : isError ? (
            <p className="px-3 py-6 text-center text-base text-destructive">{t("Unable to load users.")}</p>
          ) : users.length === 0 ? (
            <p className="px-3 py-6 text-center text-base text-muted-foreground">{t("No users found.")}</p>
          ) : (
            users.map((user) => {
              const name = userName(user);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onChange(user);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-accent"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.profileImageUrl ?? undefined} alt={name} />
                    <AvatarFallback>{name.charAt(0).toUpperCase() || <UserRound className="size-4" />}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-base font-medium text-foreground">{name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
                  </span>
                  {value?.id === user.id && <Check className="size-4 text-emerald-600" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
