"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownUp, Calculator, AlertCircle } from "lucide-react";
import { ExchangeRate } from "../CurrencyApi";
import { converterSchema, ConverterFormData } from "../schema";

interface CurrencyConverterProps {
  rates: ExchangeRate[] | undefined;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ rates }) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConverterFormData>({
    resolver: zodResolver(converterSchema),
    defaultValues: {
      amount: 100,
      fromCurrency: "USD",
      toCurrency: "KHR",
    },
  });

  const amount = watch("amount");
  const fromCurrency = watch("fromCurrency");
  const toCurrency = watch("toCurrency");

  // Automatic calculation logic
  const convertedAmount = useMemo(() => {
    if (!rates || rates.length === 0) return 0;
    const numAmount = Number(amount) || 0;
    const fromRate = rates.find((r) => r.code === fromCurrency)?.rate || 1;
    const toRate = rates.find((r) => r.code === toCurrency)?.rate || 1;

    const amountInUsd = numAmount / fromRate;
    return amountInUsd * toRate;
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setValue("fromCurrency", toCurrency);
    setValue("toCurrency", fromCurrency);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full dark:bg-slate-900 dark:border-slate-800 font-google-sans">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#FFC83D]/10 rounded-2xl text-[#003377] dark:text-[#FFC83D]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#003377] dark:text-white">
              ឧបករណ៍គណនាអត្រាប្តូរប្រាក់
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              គណនាបំប្លែងទឹកប្រាក់រវាងរូបិយប័ណ្ណផ្សេងៗតាមអត្រាប្តូរប្រាក់ជាក់ស្តែង
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ចំនួនទឹកប្រាក់
            </label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  step="any"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FFC83D] text-base font-bold text-slate-800 dark:text-white"
                  placeholder="សូមបញ្ចូលចំនួនទឹកប្រាក់"
                />
              )}
            />
            {errors.amount && (
              <p className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle size={12} />
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Currency Selectors */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                ពីរូបិយប័ណ្ណ
              </label>
              <Controller
                name="fromCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
                  >
                    {rates?.map((r) => (
                      <option key={`from-${r.code}`} value={r.code}>
                        {r.flag} {r.code}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="mt-5 p-2.5 rounded-2xl bg-slate-100 hover:bg-[#FFC83D]/20 text-[#003377] dark:text-[#FFC83D] transition-colors border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                ទៅរូបិយប័ណ្ណ
              </label>
              <Controller
                name="toCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
                  >
                    {rates?.map((r) => (
                      <option key={`to-${r.code}`} value={r.code}>
                        {r.flag} {r.code}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="mt-8 p-6 bg-[#003377] rounded-3xl text-white shadow-md dark:border-slate-800 dark:bg-slate-950">
        <div className="text-xs text-[#FFC83D] font-bold mb-1">
          លទ្ធផលបំប្លែងទឹកប្រាក់
        </div>
        <div className="text-3xl font-black tracking-tight">
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
          }).format(convertedAmount)}{" "}
          <span className="text-[#FFC83D] text-2xl font-bold">{toCurrency}</span>
        </div>
      </div>
    </div>
  );
};