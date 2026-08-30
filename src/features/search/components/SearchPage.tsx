"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  Users,
  FolderTree,
  Coins,
  MessageSquare,
  ShieldAlert,
  BellRing,
  ArrowRight,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
import { useGetGlobalSearchQuery } from "../api";
import { SearchGroupType, AdminSearchItemResponse } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useAdminI18n();

  const queryParam = searchParams.get("q") || searchParams.get("query") || "";
  const [searchInput, setSearchInput] = useState(queryParam);
  const [prevQueryParam, setPrevQueryParam] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<SearchGroupType>("all");

  if (prevQueryParam !== queryParam) {
    setPrevQueryParam(queryParam);
    setSearchInput(queryParam);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
  } = useGetGlobalSearchQuery(
    { q: queryParam, limit: 50 },
    {
      skip: !queryParam,
    },
  );

  const isSearching = (isLoading || isFetching) && Boolean(queryParam);

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

  const getItemInitial = (title?: string) => {
    if (!title) return "?";
    return title.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12 font-google-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t("Global Search")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {queryParam
              ? `${t("Total Results")}: ${totalResults} ${t("results")}`
              : t("Search users, categories, currencies, alerts...")}
          </p>
        </div>
      </div>

      {/* Main Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={20}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("Search anything...")}
            className="h-12 w-full rounded-2xl border border-slate-200/80 bg-white pl-12 pr-12 text-base text-slate-900 shadow-xs placeholder:text-slate-400 hover:border-[#003377]/40 focus:border-[#003377] focus:outline-none focus:ring-2 focus:ring-[#003377]/15 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-[#FFC83D]/40 dark:focus:border-[#FFC83D] dark:focus:ring-[#FFC83D]/20 transition-all"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                router.push("/search");
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-12 rounded-2xl bg-[#003377] px-6 text-sm font-semibold text-white hover:bg-[#002657] dark:bg-[#FFC83D] dark:text-slate-950 dark:hover:bg-[#ffbf24]"
        >
          {t("Search")}
        </Button>
      </form>

      {/* Tabs */}
      {queryParam && totalResults > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/80 pb-2 text-sm scrollbar-none dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
              activeTab === "all"
                ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span>{t("All Results")}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "users"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Users size={15} />
              <span>{t("Users")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {userCount}
              </span>
            </button>
          )}

          {categoryCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "categories"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <FolderTree size={15} />
              <span>{t("Categories")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {categoryCount}
              </span>
            </button>
          )}

          {currencyCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("currencies")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "currencies"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <Coins size={15} />
              <span>{t("Currencies")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {currencyCount}
              </span>
            </button>
          )}

          {reviewCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "reviews"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <MessageSquare size={15} />
              <span>{t("Reviews")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {reviewCount}
              </span>
            </button>
          )}

          {alertRuleCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("alertRules")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "alertRules"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldAlert size={15} />
              <span>{t("Alert Rules")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {alertRuleCount}
              </span>
            </button>
          )}

          {notificationCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
                activeTab === "notifications"
                  ? "bg-[#003377] text-white dark:bg-[#FFC83D] dark:text-slate-950 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <BellRing size={15} />
              <span>{t("Notifications")}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800 dark:text-slate-300">
                {notificationCount}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="size-10 animate-spin text-[#003377] dark:text-[#FFC83D]" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            {t("Search in progress...")}
          </p>
        </div>
      )}

      {/* Error State */}
      {!isSearching && isError && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200/80 bg-rose-50/50 p-12 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
          <AlertTriangle className="size-10 text-rose-500" />
          <h3 className="mt-3 text-base font-bold text-slate-800 dark:text-slate-200">
            {t("Search encountered an issue.")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {t("Please try again with another keyword.")}
          </p>
        </div>
      )}

      {/* No query given */}
      {!isSearching && !isError && !queryParam && (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Search size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-200">
            {t("Search across all resources")}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {t("Search users, categories, currencies, alerts...")}
          </p>
        </div>
      )}

      {/* No Results Found */}
      {!isSearching && !isError && queryParam && totalResults === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Inbox size={28} />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
            {t("No results found for")} &quot;{queryParam}&quot;
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("Try searching with a different term")}
          </p>
        </div>
      )}

      {/* Results Content */}
      {!isSearching && !isError && queryParam && totalResults > 0 && (
        <div className="space-y-8">
          {/* USERS */}
          {(activeTab === "all" || activeTab === "users") && userCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    <Users size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Users")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {userCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.users.map((user: AdminSearchItemResponse, idx: number) => {
                  const title = user?.title || t("User");
                  const subtitle = user?.subtitle || "";

                  return (
                    <button
                      key={user?.id || idx}
                      type="button"
                      onClick={() => router.push(`/user-manager?search=${encodeURIComponent(title)}`)}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          {getItemInitial(title)}
                        </div>
                        <div className="truncate">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                            {title}
                          </p>
                          {subtitle && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 border-0 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      >
                        {t("User")}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CATEGORIES */}
          {(activeTab === "all" || activeTab === "categories") && categoryCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                    <FolderTree size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Categories")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {categoryCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.categories.map((cat: AdminSearchItemResponse, idx: number) => {
                  const title = cat?.title || t("Category");
                  const subtitle = cat?.subtitle || "";

                  return (
                    <button
                      key={cat?.id || idx}
                      type="button"
                      onClick={() => router.push(`/categories?search=${encodeURIComponent(title)}`)}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs">
                          <FolderTree size={18} />
                        </div>
                        <div className="truncate">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                            {title}
                          </p>
                          {subtitle && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CURRENCIES */}
          {(activeTab === "all" || activeTab === "currencies") && currencyCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                    <Coins size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Currencies")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currencyCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.currencies.map((curr: AdminSearchItemResponse, idx: number) => {
                  const title = curr?.title || t("Currency");
                  const subtitle = curr?.subtitle || "";

                  return (
                    <button
                      key={curr?.id || idx}
                      type="button"
                      onClick={() => router.push(`/currencies?search=${encodeURIComponent(title)}`)}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          <Coins size={18} />
                        </div>
                        <div className="truncate">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                            {title}
                          </p>
                          {subtitle && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 border-0 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      >
                        {t("Currency")}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {(activeTab === "all" || activeTab === "reviews") && reviewCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
                    <MessageSquare size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Reviews")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {reviewCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.reviews.map((rev: AdminSearchItemResponse, idx: number) => {
                  const title = rev?.title || t("Review");
                  const subtitle = rev?.subtitle || "";

                  return (
                    <button
                      key={rev?.id || idx}
                      type="button"
                      onClick={() => router.push(`/feedback?search=${encodeURIComponent(title)}`)}
                      className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                          {title}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0 border-0 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        >
                          {t("Review")}
                        </Badge>
                      </div>
                      {subtitle && (
                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {subtitle}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ALERT RULES */}
          {(activeTab === "all" || activeTab === "alertRules") && alertRuleCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                    <ShieldAlert size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Alert Rules")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {alertRuleCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.alertRules.map((rule: AdminSearchItemResponse, idx: number) => {
                  const title = rule?.title || t("Alert Rule");
                  const subtitle = rule?.subtitle || "";

                  return (
                    <button
                      key={rule?.id || idx}
                      type="button"
                      onClick={() => router.push(`/alert?search=${encodeURIComponent(title)}`)}
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <div className="truncate">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                          {title}
                        </p>
                        {subtitle && (
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {subtitle}
                          </p>
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 border-0 bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      >
                        {t("Alert")}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {(activeTab === "all" || activeTab === "notifications") && notificationCount > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    <BellRing size={16} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {t("Notifications")}
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs">
                  {notificationCount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groups.notifications.map((notif: AdminSearchItemResponse, idx: number) => {
                  const title = notif?.title || t("Notification");
                  const subtitle = notif?.subtitle || "";

                  return (
                    <button
                      key={notif?.id || idx}
                      type="button"
                      onClick={() => router.push(`/notifications?search=${encodeURIComponent(title)}`)}
                      className="group flex flex-col justify-between gap-2 rounded-2xl border border-slate-200/70 bg-white p-4 text-left transition hover:border-[#003377]/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-[#FFC83D]/40"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#003377] dark:group-hover:text-[#FFC83D]">
                        {title}
                      </p>
                      {subtitle && (
                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                          {subtitle}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="mx-auto size-8 animate-spin text-primary" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
