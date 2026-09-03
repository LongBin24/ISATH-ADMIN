"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Calendar,
  ArrowRightLeft,
  AlertCircle,
} from "lucide-react";
import { CurrencyItem, TransactionRecord } from "../types";
import { transactionSchema, TransactionFormData } from "../schema";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface MultiCurrencyTransactionManagerProps {
  currencies: CurrencyItem[] | undefined;
  baseCurrency: string;
  onBaseCurrencyChange: (code: string) => void;
  onSync: () => void;
  isSyncing: boolean;
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-1",
    title: "Monthly Salary",
    category: "Salary",
    type: "INCOME",
    originalAmount: 1200,
    originalCurrency: "USD",
    date: "2026-08-01",
  },
  {
    id: "tx-2",
    title: "Grocery Shopping",
    category: "Food & Dining",
    type: "EXPENSE",
    originalAmount: 205000,
    originalCurrency: "KHR",
    date: "2026-08-03",
  },
  {
    id: "tx-3",
    title: "Internet Subscription",
    category: "Bills & Utilities",
    type: "EXPENSE",
    originalAmount: 35,
    originalCurrency: "USD",
    date: "2026-08-05",
  },
  {
    id: "tx-4",
    title: "Equipment Supplies",
    category: "Shopping",
    type: "EXPENSE",
    originalAmount: 3550,
    originalCurrency: "THB",
    date: "2026-08-07",
  },
  {
    id: "tx-5",
    title: "Project Bonus",
    category: "Bonus",
    type: "INCOME",
    originalAmount: 410000,
    originalCurrency: "KHR",
    date: "2026-08-09",
  },
];

export const MultiCurrencyTransactionManager: React.FC<MultiCurrencyTransactionManagerProps> = ({
  currencies = [],
  baseCurrency,
  onBaseCurrencyChange,
  onSync,
  isSyncing,
}) => {
  const { t } = useAdminI18n();
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Hook Form with Zod Validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      currency: "USD",
      type: "EXPENSE",
      category: "General Expense",
    },
  });

  const selectedType = watch("type");
  const formAmount = watch("amount");
  const formCurrency = watch("currency");

  const activeBaseItem = useMemo(() => {
    return currencies.find((c) => c.code === baseCurrency) || {
      code: "USD",
      name: "US Dollar",
      rate: 1,
      symbol: "$",
      flag: "🇺🇸",
    };
  }, [currencies, baseCurrency]);

  const convertAmount = useCallback(
    (origAmount: number, sourceCode: string, targetCode: string): number => {
      if (sourceCode === targetCode) return origAmount;
      const sourceObj = currencies.find((c) => c.code === sourceCode) || { rate: 1 };
      const targetObj = currencies.find((c) => c.code === targetCode) || { rate: 1 };

      const sourceRate = sourceObj.rate || 1;
      const targetRate = targetObj.rate || 1;

      const amountInUsd = origAmount / sourceRate;
      return amountInUsd * targetRate;
    },
    [currencies]
  );

  const onSubmitForm = (data: TransactionFormData) => {
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      title: data.title,
      category: data.category,
      type: data.type,
      originalAmount: data.amount,
      originalCurrency: data.currency,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions([newTx, ...transactions]);
    reset();
    setIsModalOpen(false);
  };

  const stats = useMemo(() => {
    let totalIncomeBase = 0;
    let totalExpenseBase = 0;

    transactions.forEach((tx) => {
      const converted = convertAmount(tx.originalAmount, tx.originalCurrency, baseCurrency);
      if (tx.type === "INCOME") {
        totalIncomeBase += converted;
      } else {
        totalExpenseBase += converted;
      }
    });

    const netBalanceBase = totalIncomeBase - totalExpenseBase;

    return {
      income: totalIncomeBase,
      expense: totalExpenseBase,
      balance: netBalanceBase,
    };
  }, [transactions, baseCurrency, convertAmount]);

  const liveConvertedFormAmount = useMemo(() => {
    const num = Number(formAmount) || 0;
    return convertAmount(num, formCurrency || "USD", baseCurrency);
  }, [formAmount, formCurrency, baseCurrency, convertAmount]);

  return (
    <div className="space-y-6 font-google-sans">
      {/* 1. Base Currency Selector & Exchange Rate Sync Banner */}
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FEDB55]/10 dark:text-[#FEDB55]">
                <Coins size={18} />
              </span>
              <h2 className="text-lg font-bold text-[#003377] dark:text-[#FFC83D]">
                {t("Base Currency")}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t("Select the base currency used for valuation and converting financial transactions.")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSync}
              disabled={isSyncing}
              className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-white transition disabled:opacity-50 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin text-[#003377] dark:text-[#FEDB55]" : ""} />
              <span>{isSyncing ? t("Synchronizing...") : t("Synchronize")}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                reset();
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-2xl bg-[#FEDB55] text-xs font-semibold text-[#003377] hover:bg-[#f0ca43] dark:bg-[#FEDB55] dark:text-[#003377] px-5 py-2.5 shadow-sm transition active:scale-95"
            >
              <Plus size={16} />
              <span>{t("Record Transaction")}</span>
            </button>
          </div>
        </div>

        {/* Base Currency Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
            {t("Active base currency:")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {currencies.map((curr) => {
              const isSelected = baseCurrency === curr.code;
              return (
                <button
                  key={`base-${curr.code}`}
                  type="button"
                  onClick={() => onBaseCurrencyChange(curr.code)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition border ${
                    isSelected
                      ? "bg-[#003377] text-white border-[#003377] shadow-sm dark:bg-[#FEDB55] dark:text-[#003377] dark:border-[#FEDB55]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5">
                      <span>{curr.flag || "🌐"}</span>
                      <span>{curr.code}</span>
                    </div>
                    <span className="text-xs font-normal opacity-80 mt-0.5">{t(curr.name)}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={14} className="text-[#FEDB55] dark:text-[#003377]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Auto-Converted Financial Summary Cards in Base Currency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-5 border border-emerald-500/20 dark:border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {t("Total Income")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeBaseItem.symbol}{" "}
            {stats.income.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("Converted to")} {t(activeBaseItem.name)}
          </p>
        </div>

        {/* Total Expense */}
        <div className="rounded-3xl bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent p-5 border border-rose-500/20 dark:border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              {t("Total Expense")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeBaseItem.symbol}{" "}
            {stats.expense.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("Converted to")} {t(activeBaseItem.name)}
          </p>
        </div>

        {/* Net Balance */}
        <div className="rounded-3xl bg-[#003377]/5 dark:bg-[#FEDB55]/10 p-5 border border-[#003377]/20 dark:border-[#FEDB55]/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#003377] dark:text-[#FEDB55]">
              {t("Net Balance")}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FEDB55]/20 dark:text-[#FEDB55]">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeBaseItem.symbol}{" "}
            {stats.balance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("Balance based on live rates")}
          </p>
        </div>
      </div>

      {/* 3. Recorded Transactions Table with Auto-Converted Values */}
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#003377] dark:text-[#FFC83D] flex items-center gap-2">
              <CreditCard size={18} className="text-[#003377] dark:text-[#FEDB55]" />
              {t("Multi-Currency Transactions")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("Showing recorded amount and auto-converted value in")} {t(activeBaseItem.name)}
            </p>
          </div>

          <span className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {transactions.length} {t("Transactions")}
          </span>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.map((tx) => {
            const converted = convertAmount(tx.originalAmount, tx.originalCurrency, baseCurrency);
            const currObj = currencies.find((c) => c.code === tx.originalCurrency) || {
              symbol: tx.originalCurrency,
              flag: "🌐",
            };

            return (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-700 transition gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${
                      tx.type === "INCOME"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {currObj.flag || "🌐"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {t(tx.title)}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="rounded-md bg-slate-200/60 dark:bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t(tx.category)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {tx.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-800">
                  <div
                    className={`text-base font-black ${
                      tx.type === "INCOME"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {activeBaseItem.symbol}{" "}
                    {converted.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    <span className="ml-1 text-xs font-bold text-[#003377] dark:text-[#FEDB55]">
                      ({t(activeBaseItem.name)})
                    </span>
                  </div>

                  <div className="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <ArrowRightLeft size={12} className="text-slate-400" />
                    <span>
                      {t("Original:")} {currObj.symbol} {tx.originalAmount.toLocaleString()}{" "}
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {tx.originalCurrency}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Record Transaction Modal Form with Zod Validation */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003377]/10 text-[#003377] dark:bg-[#FEDB55]/10 dark:text-[#FEDB55]">
                  <Plus size={18} />
                </div>
                <h3 className="text-base font-bold text-[#003377] dark:text-[#FFC83D] font-google-sans">
                  {t("Record New Transaction")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setValue("type", "EXPENSE")}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedType === "EXPENSE"
                      ? "bg-rose-500 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {t("Expense")}
                </button>
                <button
                  type="button"
                  onClick={() => setValue("type", "INCOME")}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedType === "INCOME"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {t("Income")}
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("Description")}
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder={t("e.g. Dining, Internet...")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 transition"
                />
                {errors.title && (
                  <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Amount & Currency Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t("Amount")}
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...register("amount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 font-bold transition"
                  />
                  {errors.amount && (
                    <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t("Currency")}
                  </label>
                  <select
                    {...register("currency")}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 font-bold transition"
                  >
                    {currencies.map((c) => (
                      <option key={`opt-${c.code}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Auto-Conversion Display in Form */}
              {Number(formAmount) > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#003377]/5 border border-[#003377]/20 dark:bg-[#FEDB55]/10 dark:border-[#FEDB55]/20 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">
                    {t("Converted to")} ({t(activeBaseItem.name)}):
                  </span>
                  <span className="font-black text-[#003377] dark:text-[#FEDB55] text-sm">
                    {activeBaseItem.symbol}{" "}
                    {liveConvertedFormAmount.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t("Category")}
                </label>
                <select
                  {...register("category")}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 transition"
                >
                  <option value="General Expense">{t("General Expense")}</option>
                  <option value="Food & Dining">{t("Food & Dining")}</option>
                  <option value="Bills & Utilities">{t("Bills & Utilities")}</option>
                  <option value="Shopping">{t("Shopping")}</option>
                  <option value="Salary">{t("Salary")}</option>
                  <option value="Bonus">{t("Bonus")}</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#FEDB55] text-xs font-semibold text-[#003377] hover:bg-[#f0ca43] dark:bg-[#FEDB55] dark:text-[#003377] px-6 py-2.5 shadow-sm transition active:scale-95"
                >
                  {t("Record Transaction")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
