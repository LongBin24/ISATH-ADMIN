"use client";

<<<<<<< HEAD
import React, { useState } from "react";
import { RefreshCw, Coins, ArrowRightLeft } from "lucide-react";
import { CurrencyConverter } from "@/features/currencies/components/CurrencyConverter";
import { ExchangeRateList } from "@/features/currencies/components/ExchangeRateList";
import { MultiCurrencyTransactionManager } from "@/features/currencies/components/MultiCurrencyTransactionManager";
import {
  useGetCurrenciesQuery,
  useSynchronizeCurrenciesMutation,
} from "@/features/currencies/CurrencyApi";
import toast from "react-hot-toast";
=======
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { CurrencyConverter } from '@/features/currencies/components/CurrencyConverter';
import { ExchangeRateList } from '@/features/currencies/components/ExchangeRateList';
import { MultiCurrencyTransactionManager } from '@/features/currencies/components/MultiCurrencyTransactionManager';
import { useGetCurrenciesQuery, useSynchronizeCurrenciesMutation } from "@/features/currencies/CurrencyApi";
import toast from 'react-hot-toast';
>>>>>>> feature/admin-api-integration

export default function CurrencyManagementPage() {
  const { data: rates, isLoading } = useGetCurrenciesQuery();
  const [sync, { isLoading: isSyncing }] = useSynchronizeCurrenciesMutation();
<<<<<<< HEAD
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [activeTab, setActiveTab] = useState<"transactions" | "converter">("transactions");
=======
  const [baseCurrency, setBaseCurrency] = useState("USD");
>>>>>>> feature/admin-api-integration

  const handleSync = async () => {
    try {
      await sync().unwrap();
<<<<<<< HEAD
      toast.success("ធ្វើសមកាលកម្មអត្រាប្តូរប្រាក់ជោគជ័យ!");
    } catch {
=======
      toast.success("ធ្វើសមកាលកម្មទិន្នន័យពី API ជោគជ័យ!"); 
    } catch (err) {
>>>>>>> feature/admin-api-integration
      toast.error("ការធ្វើសមកាលកម្មបរាជ័យ");
    }
  };

  return (
    <div className="w-full space-y-6 min-h-screen font-google-sans pb-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003377] dark:text-white flex items-center gap-3">
            <Coins className="h-8 w-8 text-[#FFC83D]" />
            <span>គ្រប់គ្រងប្រព័ន្ធរូបិយប័ណ្ណ</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            កត់ត្រាប្រតិបត្តិការហិរញ្ញវត្ថុច្រើនរូបិយប័ណ្ណ ជាមួយនឹងការបំប្លែងតម្លៃ និងសមកាលកម្មអត្រាប្តូរប្រាក់ស្វ័យប្រវត្តិ
          </p>
        </div>

        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFC83D] hover:bg-[#f6bd30] text-[#003377] font-bold shadow-md transition-all disabled:opacity-50 text-xs active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? "កំពុងធ្វើសមកាលកម្ម..." : "ធ្វើសមកាលកម្មអត្រាប្តូរប្រាក់"}</span>
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition ${
            activeTab === "transactions"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Coins size={18} />
          <span>ប្រតិបត្តិការច្រើនរូបិយប័ណ្ណ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("converter")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition ${
            activeTab === "converter"
              ? "bg-[#003377] text-white shadow-md dark:bg-[#FFC83D] dark:text-[#003377]"
              : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <ArrowRightLeft size={18} />
          <span>គណនាអត្រាប្តូរប្រាក់</span>
        </button>
      </div>

<<<<<<< HEAD
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
=======
      <MultiCurrencyTransactionManager
        currencies={rates}
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={setBaseCurrency}
        onSync={handleSync}
        isSyncing={isSyncing}
      />
>>>>>>> feature/admin-api-integration
    </div>
  );
}