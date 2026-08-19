<<<<<<< HEAD:src/app/(dashboard)/currencies/page.tsx
import CurrencyManager from "@/features/currencies/CurrencyManager";

export default function CurrencyManagementPage() {
  return <CurrencyManager />;
=======
"use client";

import React, { useState } from "react";
import { RefreshCw, Coins, ArrowRightLeft } from "lucide-react";
import { CurrencyConverter } from "@/features/currencies/components/CurrencyConverter";
import { ExchangeRateList } from "@/features/currencies/components/ExchangeRateList";
import { MultiCurrencyTransactionManager } from "@/features/currencies/components/MultiCurrencyTransactionManager";
import {
  useGetCurrenciesQuery,
  useSynchronizeCurrenciesMutation,
} from "@/features/currencies/CurrencyApi";
import { useI18n } from "@/hooks/use-i18n";
import toast from "react-hot-toast";

export default function CurrencyManagementPage() {
  const { dict } = useI18n();
  const { data: rates, isLoading } = useGetCurrenciesQuery();
  const [sync, { isLoading: isSyncing }] = useSynchronizeCurrenciesMutation();
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [activeTab, setActiveTab] = useState<"transactions" | "converter">("transactions");

  const handleSync = async () => {
    try {
      await sync().unwrap();
      toast.success(dict.common.success);
    } catch {
      toast.error(dict.common.error);
    }
  };

  return (
    <div className="w-full space-y-6 min-h-screen font-google-sans pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003377] dark:text-white flex items-center gap-3">
            <Coins className="h-8 w-8 text-[#FFC83D]" />
            <span>{dict.currencies.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {dict.currencies.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex min-w-[170px] h-11 items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFC83D] hover:bg-[#f6bd30] text-[#003377] font-bold shadow-md transition-all disabled:opacity-50 text-xs active:scale-95 whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? dict.currencies.syncing : dict.currencies.sync}</span>
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 ${
            activeTab === "transactions"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
          }`}
        >
          <Coins size={18} className="shrink-0" />
          <span>{dict.currencies.multiCurrency}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("converter")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 ${
            activeTab === "converter"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 hover:text-[#003377] dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
          }`}
        >
          <ArrowRightLeft size={18} className="shrink-0" />
          <span>{dict.currencies.calculateRate}</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === "transactions" && (
        <MultiCurrencyTransactionManager
          currencies={rates}
          baseCurrency={baseCurrency}
          onBaseCurrencyChange={setBaseCurrency}
          onSync={handleSync}
          isSyncing={isSyncing}
        />
      )}

      {activeTab === "converter" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch">
          <CurrencyConverter rates={rates} />
          <ExchangeRateList rates={rates} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f:src/app/[locale]/(dashboard)/currencies/page.tsx
}
