import React from "react";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";
import { ExchangeRate } from "../CurrencyApi";

interface ExchangeRateListProps {
  rates: ExchangeRate[] | undefined;
  isLoading: boolean;
}

const KHMER_CURRENCY_NAMES: Record<string, string> = {
  USD: "ដុល្លារអាមេរិក",
  KHR: "រៀលខ្មែរ",
  THB: "បាតថៃ",
  EUR: "អឺរ៉ូ",
  JPY: "យ៉េនជប៉ុន",
  GBP: "ផោនអង់គ្លេស",
};

export const ExchangeRateList: React.FC<ExchangeRateListProps> = ({ rates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 h-full flex flex-col items-center justify-center dark:border-slate-800 dark:bg-slate-900 font-google-sans space-y-3">
        <div className="animate-spin text-[#003377] dark:text-[#FFC83D]">
          <Globe className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold text-slate-500">កំពុងផ្ទុកអត្រាប្តូរប្រាក់...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col h-full dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 font-google-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#003377]/10 rounded-2xl text-[#003377] dark:text-[#FFC83D]">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#003377] dark:text-white">
            តារាងអត្រាប្តូរប្រាក់
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            អត្រាប្តូរប្រាក់បច្ចុប្បន្នធៀបនឹង 1 ដុល្លារអាមេរិក (USD)
          </p>
        </div>
      </div>

      {/* Rate Items List */}
      <div className="space-y-3 flex-1">
        {rates?.map((item) => {
          const changeVal = item.change ?? 0;
          const isPositive = changeVal >= 0;
          const khmerName = KHMER_CURRENCY_NAMES[item.code] || item.name;

          return (
            <div
              key={item.code}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 hover:border-slate-300 transition-all bg-slate-50/50 dark:border-slate-750 dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.code}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {khmerName}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {(item.rate ?? 0).toLocaleString()} {item.symbol}
                </div>
                <div
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 ${
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
