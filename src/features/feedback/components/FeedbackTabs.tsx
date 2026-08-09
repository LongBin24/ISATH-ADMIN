import { FeedbackStatus } from "../types";

interface FeedbackTabsProps {
  tabs: Array<{ key: FeedbackStatus; label: string }>;
  activeTab: FeedbackStatus;
  onChange: (tab: FeedbackStatus) => void;
}

export default function FeedbackTabs({
  tabs,
  activeTab,
  onChange,
}: FeedbackTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#003377] bg-[#003377] text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#003377] hover:text-[#003377] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
