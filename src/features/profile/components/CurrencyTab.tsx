"use client";

import React, { useState } from "react";
import { CurrencyCode, CurrencyOption, UserProfile } from "../types";
import { useUpdateCurrencyMutation } from "../api";
import { Coins, Check, RefreshCw, Sparkles } from "lucide-react";

interface CurrencyTabProps {
  profile: UserProfile;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    code: "KHR",
    nameKhmer: "រៀលខ្មែរ",
    symbol: "៛",
    rateVsUsd: 4100,
    exampleAmount: 1230000,
  },
  {
    code: "USD",
    nameKhmer: "ដុល្លារអាមេរិក",
    symbol: "$",
    rateVsUsd: 1,
    exampleAmount: 300,
  },
  {
    code: "EUR",
    nameKhmer: "អឺរ៉ូ",
    symbol: "€",
    rateVsUsd: 0.92,
    exampleAmount: 276,
  },
  {
    code: "THB",
    nameKhmer: "បាតថៃ",
    symbol: "฿",
    rateVsUsd: 35.5,
    exampleAmount: 10650,
  },
  {
    code: "JPY",
    nameKhmer: "យ៉េនជប៉ុន",
    symbol: "¥",
    rateVsUsd: 152,
    exampleAmount: 45600,
  },
];

export default function CurrencyTab({
  profile,
  onSuccess,
  onError,
}: CurrencyTabProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    profile.preferredCurrency
  );

  const [updateCurrency, { isLoading }] = useUpdateCurrencyMutation();

  const handleSave = async () => {
    try {
      await updateCurrency({ currency: selectedCurrency }).unwrap();
      onSuccess("បានកំណត់រូបិយប័ណ្ណដែលពេញចិត្តដោយជោគជ័យ!");
    } catch (err) {
      onError("មិនអាចផ្លាស់ប្តូររូបិយប័ណ្ណបានទេ សូមព្យាយាមម្តងទៀត");
    }
  };

  const activeOption =
    CURRENCY_OPTIONS.find((c) => c.code === selectedCurrency) || CURRENCY_OPTIONS[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 font-google-sans">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Coins className="h-5 w-5 text-[#003377] dark:text-[#FFC83D]" />
          ជ្រើសរើសរូបិយប័ណ្ណដែលពេញចិត្ត
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          រូបិយប័ណ្ណនេះនឹងត្រូវបានប្រើប្រាស់សម្រាប់ការបង្ហាញតម្លៃ របាយការណ៍ហិរញ្ញវត្ថុ និងប្រតិបត្តិការទូទាត់របស់អ្នក
        </p>
      </div>

      {/* Currency Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {CURRENCY_OPTIONS.map((opt) => {
          const isSelected = selectedCurrency === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setSelectedCurrency(opt.code)}
              className={`relative flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-[#003377] bg-[#003377]/5 ring-2 ring-[#003377] dark:border-[#FFC83D] dark:bg-[#FFC83D]/10 dark:ring-[#FFC83D]"
                  : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold ${
                    isSelected
                      ? "bg-[#003377] text-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377]"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {opt.symbol}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {opt.code}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {opt.nameKhmer}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003377] text-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377]">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Preview Demo Box */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#003377] p-5 text-white shadow-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-[#FFC83D]" />
            ការបង្ហាញទម្រង់តម្លៃគំរូ
          </span>
          <span className="rounded-md bg-[#FFC83D] px-2 py-0.5 text-[10px] font-bold text-[#003377]">
            {activeOption.code}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-slate-400">សមតុល្យគំរូ</p>
            <p className="text-2xl font-extrabold text-[#FFC83D] tracking-tight">
              {activeOption.symbol} {activeOption.exampleAmount.toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-slate-400 text-right">
            អត្រាប្រៀបធៀប៖ <br />
            ១ ដុល្លារ &approx; {activeOption.symbol} {activeOption.rateVsUsd.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || selectedCurrency === profile.preferredCurrency}
          className="flex items-center gap-2 rounded-xl bg-[#FFC83D] px-6 py-2.5 text-xs font-bold text-[#003377] shadow hover:bg-[#f0ba33] transition disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Coins className="h-4 w-4" />
          )}
          រក្សាទុករូបិយប័ណ្ណ
        </button>
      </div>
    </div>
  );
}
