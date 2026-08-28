"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  Users,
  FolderTree,
  Coins,
  MessageSquare,
  BellRing,
  Bell,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useGetGlobalSearchQuery } from "../api";
import { SearchGroupType, AdminSearchItemResponse } from "../types";
import { Badge } from "@/components/ui/badge";

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className = "" }: GlobalSearchProps) {
  const router = useRouter();
  const { t } = useAdminI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchGroupType>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Global keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Execute RTK query when debouncedSearch is not empty
  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
  } = useGetGlobalSearchQuery(
    { q: debouncedSearch, limit: 10 },
    {
      skip: !debouncedSearch,
    },
  );

  const isSearching = (isLoading || isFetching) && Boolean(debouncedSearch);

  const groups = useMemo(() => {
    return (
      searchData?.groups || {
        users: [],
        categories: [],
        currencies: [],
        reviews: [],
        alertRules: [],
        notifications: [],
      }
    );
  }, [searchData]);

  const userCount = groups.users?.length || 0;
  const categoryCount = groups.categories?.length || 0;
  const currencyCount = groups.currencies?.length || 0;
  const reviewCount = groups.reviews?.length || 0;
  const alertRuleCount = groups.alertRules?.length || 0;
  const notificationCount = groups.notifications?.length || 0;

  const totalResults =
    searchData?.totalResults ??
    userCount +
      categoryCount +
      currencyCount +
      reviewCount +
      alertRuleCount +
      notificationCount;

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleClear = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    inputRef.current?.focus();
  };

  const getItemInitial = (title?: string) => {
    if (!title) return "?";
    return title.trim().charAt(0).toUpperCase();
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xs sm:max-w-sm md:max-w-md ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t("Search...")}
          className="h-10 w-full rounded-xl border border-slate-200/70 bg-slate-50/70 pl-10 pr-20 text-sm font-normal font-google-sans text-slate-900 placeholder:text-slate-400 hover:bg-slate-100/70 focus:border-[#003377] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003377]/15 dark:border-slate-800/80 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:bg-slate-800 dark:focus:border-[#FFC83D] dark:focus:bg-slate-900 dark:focus:ring-[#FFC83D]/20 transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
              aria-label={t("Clear")}
            >
              <X size={14} />
            </button>
          )}

          {isSearching ? (
            <div className="flex size-6 items-center justify-center text-primary">
              <Loader2 size={15} className="animate-spin text-[#003377] dark:text-[#FFC83D]" />
            </div>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-xs dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Search Dropdown / Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[80vh] w-full min-w-[320px] sm:min-w-[420px] md:min-w-[500px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-900/95">
          {/* Top category tabs if we have a search term */}
          {debouncedSearch && totalResults > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 p-2 text-xs scrollbar-none dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <span>{t("All")}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === "all"
                    ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950 font-bold"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}>
                  {totalResults}
                </span>
              </button>

              {userCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "users"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Users size={13} />
                  <span>{t("Users")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {userCount}
                  </span>
                </button>
              )}

              {categoryCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("categories")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "categories"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <FolderTree size={13} />
                  <span>{t("Categories")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {categoryCount}
                  </span>
                </button>
              )}

              {currencyCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("currencies")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "currencies"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <Coins size={13} />
                  <span>{t("Currencies")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {currencyCount}
                  </span>
                </button>
              )}

              {reviewCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "reviews"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <MessageSquare size={13} />
                  <span>{t("Reviews")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {reviewCount}
                  </span>
                </button>
              )}

              {alertRuleCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("alertRules")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "alertRules"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <ShieldAlert size={13} />
                  <span>{t("Alert Rules")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {alertRuleCount}
                  </span>
                </button>
              )}

              {notificationCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    activeTab === "notifications"
                      ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <BellRing size={13} />
                  <span>{t("Notifications")}</span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] dark:bg-slate-800 dark:text-slate-300">
                    {notificationCount}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Results List Container */}
          <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 space-y-4">
            {/* Case 1: Initial Empty Search Input -> Quick Shortcuts */}
            {!debouncedSearch && (
              <div className="py-2">
                <div className="flex items-center justify-between px-2 pb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t("Quick Links")}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {t("Navigation")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {[
                    { label: t("Users"), icon: Users, path: "/user-manager", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" },
                    { label: t("Categories"), icon: FolderTree, path: "/categories", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
                    { label: t("Currencies"), icon: Coins, path: "/currencies", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400" },
                    { label: t("Reviews"), icon: MessageSquare, path: "/feedback", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400" },
                    { label: t("Alert Rules"), icon: ShieldAlert, path: "/alert", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400" },
                    { label: t("Notifications"), icon: Bell, path: "/notifications", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleNavigate(item.path)}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-100 p-2.5 text-left transition hover:border-[#003377]/30 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:border-[#FFC83D]/30 dark:hover:bg-slate-800/50"
                      >
                        <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case 2: Loading State */}
            {isSearching && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Loader2 className="size-8 animate-spin text-[#003377] dark:text-[#FFC83D]" />
                <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {t("Search in progress...")}
                </p>
              </div>
            )}

            {/* Case 3: Error State */}
            {!isSearching && isError && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="size-8 text-amber-500" />
                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t("Search encountered an issue.")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("Please try again with another keyword.")}
                </p>
              </div>
            )}

            {/* Case 4: No Results Found */}
            {!isSearching && !isError && debouncedSearch && totalResults === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <Inbox size={24} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("No results found for")} &quot;{debouncedSearch}&quot;
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("Try searching with a different term")}
                </p>
              </div>
            )}

            {/* Case 5: Results Display */}
            {!isSearching && debouncedSearch && totalResults > 0 && (
              <>
                {/* 1. USERS GROUP */}
                {(activeTab === "all" || activeTab === "users") && userCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-blue-500" />
                        <span>{t("Users")}</span>
                      </div>
                      <span>{userCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.users.map((user: AdminSearchItemResponse, idx: number) => {
                        const title = user?.title || t("User");
                        const subtitle = user?.subtitle || "";

                        return (
                          <button
                            key={user?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/user-manager?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                {getItemInitial(title)}
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 font-medium border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                              >
                                {t("User")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. CATEGORIES GROUP */}
                {(activeTab === "all" || activeTab === "categories") && categoryCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <FolderTree size={14} className="text-emerald-500" />
                        <span>{t("Categories")}</span>
                      </div>
                      <span>{categoryCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.categories.map((cat: AdminSearchItemResponse, idx: number) => {
                        const title = cat?.title || t("Category");
                        const subtitle = cat?.subtitle || "";

                        return (
                          <button
                            key={cat?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/categories?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs">
                                <FolderTree size={16} />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                              >
                                {t("Category")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. CURRENCIES GROUP */}
                {(activeTab === "all" || activeTab === "currencies") && currencyCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Coins size={14} className="text-amber-500" />
                        <span>{t("Currencies")}</span>
                      </div>
                      <span>{currencyCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.currencies.map((curr: AdminSearchItemResponse, idx: number) => {
                        const title = curr?.title || t("Currency");
                        const subtitle = curr?.subtitle || "";

                        return (
                          <button
                            key={curr?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/currencies?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                <Coins size={16} />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                              >
                                {t("Currency")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. REVIEWS GROUP */}
                {(activeTab === "all" || activeTab === "reviews") && reviewCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-purple-500" />
                        <span>{t("Reviews")}</span>
                      </div>
                      <span>{reviewCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.reviews.map((rev: AdminSearchItemResponse, idx: number) => {
                        const title = rev?.title || t("Review");
                        const subtitle = rev?.subtitle || "";

                        return (
                          <button
                            key={rev?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/feedback?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-purple-100 font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                <MessageSquare size={16} />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-0 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                              >
                                {t("Review")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. ALERT RULES GROUP */}
                {(activeTab === "all" || activeTab === "alertRules") && alertRuleCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert size={14} className="text-rose-500" />
                        <span>{t("Alert Rules")}</span>
                      </div>
                      <span>{alertRuleCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.alertRules.map((rule: AdminSearchItemResponse, idx: number) => {
                        const title = rule?.title || t("Alert Rule");
                        const subtitle = rule?.subtitle || "";

                        return (
                          <button
                            key={rule?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/alert?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-100 font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                <ShieldAlert size={16} />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-0 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              >
                                {t("Alert")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 6. NOTIFICATIONS GROUP */}
                {(activeTab === "all" || activeTab === "notifications") && notificationCount > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <BellRing size={14} className="text-indigo-500" />
                        <span>{t("Notifications")}</span>
                      </div>
                      <span>{notificationCount}</span>
                    </div>

                    <div className="space-y-1">
                      {groups.notifications.map((notif: AdminSearchItemResponse, idx: number) => {
                        const title = notif?.title || t("Notification");
                        const subtitle = notif?.subtitle || "";

                        return (
                          <button
                            key={notif?.id || idx}
                            type="button"
                            onClick={() => handleNavigate(`/notifications?search=${encodeURIComponent(title)}`)}
                            className="group flex w-full items-center justify-between gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                                <BellRing size={16} />
                              </div>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                                  {title}
                                </p>
                                {subtitle && (
                                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                    {subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-0 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                              >
                                {t("Notification")}
                              </Badge>
                              <ArrowRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-3.5 py-2 text-[11px] text-slate-400 dark:border-slate-800/80 dark:bg-slate-900/90">
            {debouncedSearch && totalResults > 0 ? (
              <button
                type="button"
                onClick={() => handleNavigate(`/search?q=${encodeURIComponent(debouncedSearch)}`)}
                className="flex items-center gap-1 font-semibold text-[#003377] hover:underline dark:text-[#FFC83D]"
              >
                <span>{t("View all results")}</span>
                <ArrowRight size={12} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#003377] dark:text-[#FFC83D]" />
                <span>iStash Global Search</span>
              </div>
            )}
            <span>{t("Press ESC to close")}</span>
          </div>
        </div>
      )}
    </div>
  );
}
