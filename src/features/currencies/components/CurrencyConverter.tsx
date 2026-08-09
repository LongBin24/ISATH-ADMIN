'use client';

import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowDownUp, Calculator } from 'lucide-react';
import { ExchangeRate } from '../CurrencyApi';
import { number } from 'zod';

interface ConverterFormValues{
    amount : number ;
    fromCurrency: string;
    toCurrency:string;
}
interface CurrencyConverterProps{
    rates: ExchangeRate[] | undefined;
}
export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ rates }) => {
  const { control, watch, setValue } = useForm<ConverterFormValues>({
    defaultValues: {
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'KHR',
    },
  });

  const amount = watch('amount');
  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');

  // Automatic calculation logic
  const convertedAmount = useMemo(() => {
    if (!rates||rates.length===0) return 0;
    const fromRate = rates.find((r) => r.code === fromCurrency)?.rate || 1;
    const toRate = rates.find((r) => r.code === toCurrency)?.rate || 1;
    
    // Convert to base (USD) then to target currency
    const amountInUsd = amount / fromRate;
    const result = amountInUsd * toRate;
    return result;
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setValue('fromCurrency', toCurrency);
    setValue('toCurrency', fromCurrency);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#FFC83D]/10 rounded-xl text-[#003377]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#003377] font-google-sans">
              Currency Converter
            </h2>
            <p className="text-sm text-slate-500 font-google-sans">
              ឧបករណ៍គណនាអត្រាប្តូរប្រាក់
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 font-google-sans">
              ទឹកប្រាក់ (Amount)
            </label>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FFC83D] font-google-sans text-lg text-slate-800"
                  placeholder="Enter amount"
                />
              )}
            />
          </div>

          {/* Currency Selectors */}
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 font-google-sans">
                ពី (From)
              </label>
              <Controller
                name="fromCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-google-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
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
              className="mt-5 p-2.5 rounded-xl bg-slate-50 hover:bg-[#FFC83D]/20 text-[#003377] transition-colors border border-slate-200"
              title="Swap currencies"
            >
              <ArrowDownUp className="w-5 h-5" />
            </button>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 font-google-sans">
                ទៅ (To)
              </label>
              <Controller
                name="toCurrency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-google-sans text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FFC83D]"
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
      <div className="mt-8 p-6 bg-[#003377] rounded-2xl text-white shadow-md">
        <div className="text-xs font-google-sans text-[#FFC83D] mb-1">
          លទ្ធផលគណនា (Converted Result)
        </div>
        <div className="text-3xl font-bold font-google-sans tracking-tight">
          {new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2,
          }).format(convertedAmount)}{' '}
          <span className="text-[#FFC83D] text-2xl font-normal">{toCurrency}</span>
        </div>
      </div>
    </div>
  );
};