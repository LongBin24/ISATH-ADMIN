<<<<<<< HEAD
import React from "react";
import { Plus } from "lucide-react";
import { useAdminI18n } from "@/i18n/admin-i18n";
=======
"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

interface AddCategoryCardProps {
  onClick: () => void;
}

export const AddCategoryCard: React.FC<AddCategoryCardProps> = ({ onClick }) => {
<<<<<<< HEAD
  const { t } = useAdminI18n();
=======
  const { dict } = useI18n();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#FFC83D] bg-slate-50/50 hover:bg-[#FFC83D]/5 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer dark:border-slate-800 dark:bg-slate-900/50 font-google-sans"
    >
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#003377] group-hover:bg-[#FFC83D] group-hover:text-[#003377] transition-colors dark:bg-slate-800">
        <Plus className="w-6 h-6" />
      </div>
      <div className="text-center">
<<<<<<< HEAD
        <span className="block font-bold text-[#003377] font-google-sans text-sm">
          {t("Add Category")}
        </span>
        <span className="text-xs text-slate-400 font-google-sans">
          {t("Create Category")}
=======
        <span className="block font-bold text-[#003377] dark:text-slate-100 text-sm">
          {dict.categories.newCategory}
        </span>
        <span className="text-xs text-slate-400">
          {dict.categories.createCategory}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
        </span>
      </div>
    </button>
  );
};
