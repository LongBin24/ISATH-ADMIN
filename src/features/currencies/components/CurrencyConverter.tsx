"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownUp, Calculator, AlertCircle } from "lucide-react";
import { ExchangeRate } from "../CurrencyApi";
import { converterSchema, ConverterFormData } from "../schema";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface CurrencyConverterProps {
  rates: ExchangeRate[] | undefined;
}

const DEFAULT_CURRENCIES: ExchangeRate[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1, active: true },
  { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭", rate: 4050, active: true },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rate: 33.5, active: true },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.87, active: true },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 158.5, active: true },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.74, active: true },
];

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ rates }) => {
  const { t } = useAdminI18n();
  const activeRates = useMemo(() => {
    return rates && rates.length > 0 ? rates : DEFAULT_CURRENCIES;
  }, [rates]);

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
    const numAmount = Number(amount) || 0;
    const fromRate = activeRates.find((r) => r.code === fromCurrency)?.rate || 1;
    const toRate = activeRates.find((r) => r.code === toCurrency)?.rate || 1;

    const amountInUsd = numAmount / fromRate;
    return amountInUsd * toRate;
  }, [amount, fromCurrency, toCurrency, activeRates]);

  const handleSwap = () => {
    setValue("fromCurrency", toCurrency);
    setValue("toCurrency", fromCurrency);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col justify-between h-full dark:bg-slate-900 dark:border-slate-800 font-google-sans">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#003377]/10 dark:bg-[#FEDB55]/10 rounded-2xl text-[#003377] dark:text-[#FEDB55]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#003377] dark:text-[#FFC83D]">
              {t("Currency Converter")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("Calculate currency conversion according to live exchange rates.")}
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("Amount")}
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
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 text-base font-bold text-slate-800 dark:text-white transition"
                  placeholder={t("Enter amount")}
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
                {t("From Currency")}
              </label>
              <Controller
                name="fromCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 transition"
                  >
                    {activeRates?.map((r) => (
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
              aria-label={t("Swap currencies")}
              className="mt-5 p-2.5 rounded-2xl bg-slate-100 hover:bg-[#FEDB55]/20 text-[#003377] dark:text-[#FEDB55] transition-colors border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-[#FEDB55]/40 dark:hover:bg-slate-700"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                {t("To Currency")}
              </label>
              <Controller
                name="toCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#003377] focus:ring-2 focus:ring-[#003377]/20 dark:focus:border-[#FEDB55] dark:focus:ring-[#FEDB55]/20 transition"
                  >
                    {activeRates?.map((r) => (
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
      <div className="mt-8 p-6 bg-gradient-to-br from-[#003377] to-[#00224f] rounded-3xl text-white shadow-md dark:border dark:border-[#FEDB55]/20 dark:from-[#00224f] dark:to-slate-900">
        <div className="text-xs text-[#FEDB55] font-bold mb-1">
          {t("Conversion Result")}
        </div>
        <div className="text-3xl font-black tracking-tight">
          {new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
          }).format(convertedAmount)}{" "}
          <span className="text-[#FEDB55] text-2xl font-bold">{toCurrency}</span>
        </div>
      </div>
    </div>
  );
};