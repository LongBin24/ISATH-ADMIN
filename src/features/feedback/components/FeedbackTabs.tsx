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
    <div
      role="tablist"
      aria-label="ត្រងមតិកែលម្អតាមស្ថានភាព"
      className="-mx-3 flex snap-x gap-2 overflow-x-auto px-3 pb-1 font-google-sans [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-[#003377] bg-[#003377] text-white shadow-sm dark:border-[#FFC83D] dark:bg-[#FFC83D] dark:text-[#003377]"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#FFC83D] hover:text-[#003377] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white dark:hover:border-slate-500"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
