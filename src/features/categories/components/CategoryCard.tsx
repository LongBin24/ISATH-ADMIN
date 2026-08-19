"use client";

import { FolderTree, KeyRound, Pencil, Trash2 } from "lucide-react";
import { Category } from "../types";
import { DynamicIcon } from "./DynamicIcon";
<<<<<<< HEAD
import { useAdminI18n } from "@/i18n/admin-i18n";
=======
import { useI18n } from "@/hooks/use-i18n";
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
<<<<<<< HEAD
  const { t } = useAdminI18n();
=======
  const { dict } = useI18n();
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
  const type = (category.type ?? "expense").toLowerCase();
  const color = category.color?.startsWith("#") ? category.color : "#3b82f6";

  return (
    <article
<<<<<<< HEAD
      className="group relative flex min-h-[217px] flex-col rounded-[20px] border border-slate-900/10 bg-white p-5 shadow-[0_2px_3px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
    >
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-xl border border-slate-100 bg-white/95 p-1 opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
        <button type="button" onClick={() => onEdit(category)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-600 dark:hover:text-white" aria-label={`${t("Edit Category")} ${category.name}`}>
          <Pencil className="size-4" />
        </button>
        <button type="button" onClick={() => onDelete(category)} className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/60 dark:hover:text-rose-300" aria-label={`${t("Delete Category")} ${category.name}`}>
=======
      className="group relative flex min-h-[217px] flex-col rounded-[20px] border border-slate-900/10 bg-white p-5 shadow-[0_2px_3px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 font-google-sans"
    >
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-xl border border-slate-100 bg-white/95 p-1 opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-600 dark:hover:text-white"
          aria-label={`${dict.common.edit} ${category.name}`}
          title={dict.common.edit}
        >
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/60 dark:hover:text-rose-300"
          aria-label={`${dict.common.delete} ${category.name}`}
          title={dict.common.delete}
        >
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex items-start gap-3">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-[20px]"
          style={{
            color,
            backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
          }}
        >
          <DynamicIcon name={category.icon} className="size-6" />
        </div>
<<<<<<< HEAD
        <span className={`mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {type === "income" ? t("Income") : t("Expense")}
=======
        <span
          className={`mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            type === "income"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
          }`}
        >
          {type === "income" ? dict.transactions.income : dict.transactions.expense}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
        </span>
      </div>

      <h3 className="mt-3 truncate text-[22px] font-bold text-[#003377] dark:text-slate-100">
        {category.name}
      </h3>

      <div className="mt-auto space-y-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <FolderTree className="size-3.5" />
<<<<<<< HEAD
          <span className="truncate">{category.parentName ? `${t("Subcategory of")} ${category.parentName}` : t("Root Category")}</span>
=======
          <span className="truncate">
            {category.parentName
              ? `${dict.categories.subcategoryOf} ${category.parentName}`
              : dict.categories.rootCategory}
          </span>
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <KeyRound className="size-3.5 shrink-0" />
<<<<<<< HEAD
            <span className="truncate font-mono">{category.categoryKey || t("No Key")}</span>
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${category.systemCategory ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
            {category.systemCategory ? t("System") : t("Custom")}
=======
            <span className="truncate font-mono">
              {category.categoryKey || dict.categories.noKey}
            </span>
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${
              category.systemCategory
                ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {category.systemCategory
              ? dict.categories.system
              : dict.categories.custom}
>>>>>>> 17cb3ce3e288d4fd37c9f2ea926c41fd3cc16c0f
          </span>
        </div>
      </div>
    </article>
  );
}
