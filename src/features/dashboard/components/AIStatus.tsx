"use client";

import { useI18n } from "@/hooks/use-i18n";

export default function AIStatus() {
  const { dict } = useI18n();

  const aiMetrics = [
    { label: dict.dashboard.aiCategorization, value: 98.2 },
    { label: dict.dashboard.aiOcr, value: 94.4 },
    { label: dict.dashboard.aiVoice, value: 91.4 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 font-google-sans">
      <h3 className="text-lg font-bold mb-6 font-google-sans text-[#003377] dark:text-white">
        {dict.dashboard.aiStatus}
      </h3>
      <div className="space-y-6">
        {aiMetrics.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{item.label}</span>
              <span className="font-bold text-green-600">{item.value}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                style={{ width: `${item.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}