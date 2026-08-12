import React from "react";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";
import {
  ExchangeRate,
  useActivateCurrencyMutation,
  useDeactivateCurrencyMutation,
} from "../CurrencyApi";
import toast from "react-hot-toast";

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
  AUD: "ដុល្លារអូស្ត្រាលី",
  CAD: "ដុល្លារកាណាដា",
  CNY: "យ័នចិន",
  SGD: "ដុល្លារសិង្ហបុរី",
  KRW: "វ៉ុនកូរ៉េខាងត្បូង",
  VND: "ដុងវៀតណាម",
};

export const ExchangeRateList: React.FC<ExchangeRateListProps> = ({ rates, isLoading }) => {
  const [activateCurrency] = useActivateCurrencyMutation();
  const [deactivateCurrency] = useDeactivateCurrencyMutation();

  const handleToggle = async (code: string, currentActive: boolean) => {
    try {
      if (currentActive) {
        await deactivateCurrency(code).unwrap();
        toast.success(`បានបិទដំណើរការ ${code} ជោគជ័យ`);
      } else {
        await activateCurrency(code).unwrap();
        toast.success(`បានបើកដំណើរការ ${code} ជោគជ័យ`);
      }
    } catch {
      toast.error("មានបញ្ហាក្នុងការផ្លាស់ប្តូរស្ថានភាព");
    }
  };

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
        <div className="p-3 bg-[#003377]/10 rounded-2xl text-[#003377] dark:bg-[#FFC83D]/10 dark:text-[#FFC83D]">
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
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        item.active
                          ? "bg-[#003377]/10 text-[#003377] dark:bg-[#FFC83D]/20 dark:text-[#FFC83D]"
                          : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.active ? "សកម្ម" : "អសកម្ម"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {khmerName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
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
                  title={item.active ? `Turn OFF ${item.code}` : `Turn ON ${item.code}`}
                >
                  <span className="sr-only">Toggle {item.code}</span>

                  {/* ON Text */}
                  <span
                    className={`absolute left-2 text-[10px] font-black uppercase tracking-tight transition-opacity duration-200 select-none ${
                      item.active
                        ? "opacity-100 text-[#FFC83D] dark:text-[#003377]"
                        : "opacity-0"
                    }`}
                  >
                    ON
                  </span>

                  {/* OFF Text */}
                  <span
                    className={`absolute right-2 text-[10px] font-extrabold uppercase tracking-tight transition-opacity duration-200 select-none ${
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
