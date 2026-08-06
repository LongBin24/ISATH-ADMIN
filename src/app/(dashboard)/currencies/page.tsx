'use client';

import React from 'react';
import { Files, RefreshCw } from 'lucide-react';
import { useGetExchangRatesQuery } from '../../../features/currencies/CurrencyApi';
import { CurrencyConverter } from '../../../features/currencies/components/CurrencyConverter';
import { ExchangeRateList } from '../../../features/currencies/components/ExchangeRateList';

export default function CurrencyManagementPage() {
  const { data: rates, isLoading, refetch, isFetching } = useGetExchangRatesQuery();


  return (
    <div className="w-full space-y-8 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#003377] font-google-sans">
            រូបិយប័ណ្ណ  
          </h1>
          <p className="text-slate-500 font-google-sans mt-1">
            គ្រប់គ្រងរូបិយប័ណ្ណ
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFC83D] hover:bg-[#f6bd30] text-[#003377] font-bold font-google-sans shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          <span>ធ្វើបច្ចុប្បន្នភាព</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-stretch">
        <CurrencyConverter rates={rates} />

        <ExchangeRateList rates={rates} isLoading={isLoading} />
      </div>
    </div>
  );
}