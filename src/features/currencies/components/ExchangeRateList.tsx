import React  from "react";
import { TrendingUp, TrendingDown, Globe } from "lucide-react";
import { ExchangeRate } from "../CurrencyApi";

interface ExchangeRateListProps{
    rates: ExchangeRate[] | undefined
    isLoading:boolean;
}

export const ExchangeRateList: React.FC<ExchangeRateListProps> = ({ rates, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-full flex items-center justify-center">
        <div className="animate-spin text-[#003377]">
          <Globe className="w-8 h-8" />
        </div>
      </div>
    );
  }
return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#003377]/10 rounded-xl text-[#003377]">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#003377] font-google-sans">
            Exchange Rates
          </h2>
          <p className="text-sm text-slate-500 font-google-sans">
            តារាងអត្រាប្តូរប្រាក់បច្ចុប្បន្ន
          </p>
        </div>
      </div>

      {/* Rate Items List */}
      <div className="space-y-4 flex-1">
        {rates?.map((item) => {
          const isPositive = item.change >= 0;
          return (
            <div
              key={item.code}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <div>
                  <div className="font-bold text-slate-800 font-google-sans">
                    {item.code}
                  </div>
                  <div className="text-xs text-slate-500 font-google-sans">
                    {item.name}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-slate-900 font-google-sans">
                  {item.rate.toLocaleString()}
                </div>
                <div
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                    isPositive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
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
