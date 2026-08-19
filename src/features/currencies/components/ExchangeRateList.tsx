"use client";

import React from "react";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";
import {
  ExchangeRate,
  useActivateCurrencyMutation,
  useDeactivateCurrencyMutation,
} from "../CurrencyApi";
import { useI18n } from "@/hooks/use-i18n";
import toast from "react-hot-toast";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface ExchangeRateListProps {
  rates: ExchangeRate[] | undefined;
  isLoading: boolean;
}

export const ExchangeRateList: React.FC<ExchangeRateListProps> = ({ rates, isLoading }) => {
<<<<<<< HEAD
  const { t } = useAdminI18n();
=======
  const { dict, isEnglish } = useI18n();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  const [activateCurrency] = useActivateCurrencyMutation();
  const [deactivateCurrency] = useDeactivateCurrencyMutation();

  const handleToggle = async (code: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await deactivateCurrency(code).unwrap();
<<<<<<< HEAD
        toast.success(`${code} ${t("deactivated successfully.")}`);
      } else {
        await activateCurrency(code).unwrap();
        toast.success(`${code} ${t("activated successfully.")}`);
      }
    } catch {
      toast.error(t("Unable to change currency status."));
=======
        toast.success(
          isEnglish
            ? `Successfully deactivated ${code}`
            : `បានបិទដំណើរការ ${code} ជោគជ័យ`
        );
      } else {
        await activateCurrency(code).unwrap();
        toast.success(
          isEnglish
            ? `Successfully activated ${code}`
            : `បានបើកដំណើរការ ${code} ជោគជ័យ`
        );
      }
    } catch {
      toast.error(dict.common.error);
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 h-full flex flex-col items-center justify-center dark:border-slate-800 dark:bg-slate-900 font-google-sans space-y-3">
        <div className="animate-spin text-[#003377] dark:text-[#FFC83D]">
          <Globe className="w-8 h-8" />
        </div>
<<<<<<< HEAD
        <p className="text-xs font-bold text-slate-500">{t("Loading...")}</p>
=======
        <p className="text-xs font-bold text-slate-500">{dict.currencies.loadingRates}</p>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col h-full dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-google-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#003377]/10 rounded-2xl text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#003377] dark:text-white">
<<<<<<< HEAD
            {t("Exchange Rates Table")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("Live exchange rates compared to 1 US Dollar (USD)")}
=======
            {dict.currencies.exchangeRatesTable}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {dict.currencies.exchangeRatesTableSubtitle}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </p>
        </div>
      </div>

      {/* Rate Items List */}
      <div className="space-y-3 flex-1">
        {rates?.map((item) => {
          const changeVal = item.change ?? 0;
          const isPositive = changeVal >= 0;
<<<<<<< HEAD
=======
          const currencyLabel = isEnglish
            ? item.name
            : KHMER_CURRENCY_NAMES[item.code] || item.name;
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

          return (
            <div
              key={item.code}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                item.active
                  ? "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 hover:border-[#003377]/30 dark:hover:border-[#FFC83D]/40 hover:shadow-sm"
                  : "bg-slate-100/40 dark:bg-slate-850/20 border-slate-200/40 opacity-70 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <span>{item.code}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                        item.active
                          ? "bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
<<<<<<< HEAD
                      {t(item.active ? "Active" : "Inactive")}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t(item.name)}
=======
                      {item.active ? dict.common.active : dict.common.inactive}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currencyLabel}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {(item.rate ?? 0).toLocaleString()} {item.symbol}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                      isPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                </div>

                {/* Modern Primary ON / OFF Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggle(item.code, item.active)}
                  className={`group relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full p-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#003377]/30 dark:focus:ring-[#FFC83D]/30 ${
                    item.active
                      ? "bg-[#003377] dark:bg-[#FFC83D] shadow-sm"
                      : "bg-slate-200 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700"
                  }`}
                  role="switch"
                  aria-checked={item.active}
                  title={item.active ? `${t("Deactivate")} ${item.code}` : `${t("Activate")} ${item.code}`}
                >
                  <span className="sr-only">Toggle {item.code}</span>

                  {/* ON Text */}
                  <span
                    className={`absolute left-2 text-xs font-black uppercase tracking-tight transition-opacity duration-200 select-none ${
                      item.active
                        ? "opacity-100 text-[#FFC83D] dark:text-[#003377]"
                        : "opacity-0"
                    }`}
                  >
                    ON
                  </span>

                  {/* OFF Text */}
                  <span
                    className={`absolute right-2 text-xs font-extrabold uppercase tracking-tight transition-opacity duration-200 select-none ${
                      !item.active
                        ? "opacity-100 text-slate-400 dark:text-slate-500"
                        : "opacity-0"
                    }`}
                  >
                    OFF
                  </span>

                  {/* Sliding Knob */}
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-md transition duration-300 ease-out flex items-center justify-center ${
                      item.active
                        ? "translate-x-8 bg-white dark:bg-[#003377] text-[#003377] dark:text-[#FFC83D]"
                        : "translate-x-0 bg-white dark:bg-slate-600 text-slate-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition-colors ${
                        item.active
                          ? "bg-[#003377] dark:bg-[#FFC83D]"
                          : "bg-slate-400 dark:bg-slate-400"
                      }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
