import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Category } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import {
  categoryColorStyles,
  categoryIconAssets,
  defaultCategoryStyle,
  formatCategoryCurrency,
} from "../presentation";

interface CategoryCardProps {
  category: Category;
  onOpen: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const spentAmount = category.spentAmount ?? 0;
  const progress = category.totalBudget
    ? Math.min((spentAmount / category.totalBudget) * 100, 100)
    : 0;
  const styles =
    categoryColorStyles[category.color ?? ""] ?? defaultCategoryStyle;
  const iconAsset = categoryIconAssets[category.icon];
<<<<<<< HEAD
  const canModify =
    !category.systemCategory && category.ownedByCurrentUser !== false;
=======
>>>>>>> feature/admin-api-integration

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => onOpen(category)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(category);
        }
      }}
      className="group relative flex h-[217px] cursor-pointer flex-col rounded-[20px] border border-slate-900/10 bg-white p-5 shadow-[0_2px_3px_rgba(0,0,0,0.12)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900"
    >
<<<<<<< HEAD
      {canModify && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-xl border border-slate-100 bg-white/95 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
=======
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-xl border border-slate-100 bg-white/95 p-1 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
>>>>>>> feature/admin-api-integration
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(category);
          }}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-700"
          aria-label={`កែសម្រួល ${category.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(category.id);
          }}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700"
          aria-label={`លុប ${category.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
<<<<<<< HEAD
        </div>
      )}
=======
      </div>
>>>>>>> feature/admin-api-integration

      <div className={`flex size-14 shrink-0 items-center justify-center rounded-[20px] ${styles.icon}`}>
        <div className="relative size-6">
          {iconAsset ? (
            <Image src={iconAsset} alt="" fill sizes="24px" className="object-contain" />
          ) : (
            <DynamicIcon name={category.icon} className="size-6" />
          )}
        </div>
      </div>

      <h3 className="mt-3.5 truncate text-[22px] font-bold leading-tight text-[#003377] dark:text-slate-100">
        {category.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {category.transactionCount} ប្រតិបត្តិការ
      </p>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${progress}%`, backgroundColor: styles.accent }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-sm">
        <span style={{ color: styles.accent }}>
          {formatCategoryCurrency(spentAmount)}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {formatCategoryCurrency(category.totalBudget)}
        </span>
      </div>
    </article>
  );
};
