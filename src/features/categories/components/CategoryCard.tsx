import { FolderTree, KeyRound, Pencil, Trash2 } from "lucide-react";
import { Category } from "../types";
import { DynamicIcon } from "./DynamicIcon";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const type = (category.type ?? "expense").toLowerCase();
  const color = category.color?.startsWith("#") ? category.color : "#3b82f6";

  return (
    <article
      className="group relative flex min-h-[217px] flex-col rounded-[20px] border border-slate-900/10 bg-white p-5 shadow-[0_2px_3px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-xl border border-slate-100 bg-white/95 p-1 opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-800/95">
        <button type="button" onClick={() => onEdit(category)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-700" aria-label={`កែសម្រួល ${category.name}`}>
          <Pencil className="size-4" />
        </button>
        <button type="button" onClick={() => onDelete(category)} className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700" aria-label={`លុប ${category.name}`}>
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
        <span className={`mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {type === "income" ? "ចំណូល" : "ចំណាយ"}
        </span>
      </div>

      <h3 className="mt-3 truncate text-[22px] font-bold text-[#003377] dark:text-slate-100">{category.name}</h3>

      <div className="mt-auto space-y-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <FolderTree className="size-3.5" />
          <span className="truncate">{category.parentName ? `ប្រភេទរងនៃ ${category.parentName}` : "ប្រភេទដើម"}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <KeyRound className="size-3.5 shrink-0" />
            <span className="truncate font-mono">{category.categoryKey || "គ្មានលេខកូដ"}</span>
          </span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 font-semibold ${category.systemCategory ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
            {category.systemCategory ? "ប្រព័ន្ធ" : "ផ្ទាល់ខ្លួន"}
          </span>
        </div>
      </div>
    </article>
  );
}
