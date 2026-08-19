"use client";

import React from "react";
import { FolderTree, KeyRound, Pencil, Trash2 } from "lucide-react";
import { Category } from "../types";
import { DynamicIcon } from "./DynamicIcon";
import { useI18n } from "@/hooks/use-i18n";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { dict } = useI18n();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 font-google-sans">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-slate-850">
            <TableRow className="border-b border-slate-200/80 dark:border-slate-800">
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300">
                {dict.categories.categoryName}
              </TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300">
                {dict.categories.transactionType}
              </TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300">
                {dict.categories.parentCategory}
              </TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300">
                {dict.categories.key}
              </TableHead>
              <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300">
                {dict.categories.systemCategoryTitle}
              </TableHead>
              <TableHead className="py-4 text-right text-xs font-bold uppercase tracking-wider text-[#003377] dark:text-slate-300 pr-6">
                {dict.common.actions}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((category) => {
              const type = (category.type ?? "expense").toLowerCase();
              const color = category.color?.startsWith("#") ? category.color : "#3b82f6";

              return (
                <TableRow
                  key={category.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Name and Icon */}
                  <TableCell className="py-3.5 pl-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105"
                        style={{
                          color,
                          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
                        }}
                      >
                        <DynamicIcon name={category.icon} className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                          {category.name}
                        </p>
                        {category.categoryKey && (
                          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            {category.categoryKey}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Transaction Type */}
                  <TableCell className="py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${
                        type === "income"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
                      }`}
                    >
                      {type === "income" ? dict.transactions.income : dict.transactions.expense}
                    </span>
                  </TableCell>

                  {/* Hierarchy Parent */}
                  <TableCell className="py-3.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 max-w-[200px]">
                      <FolderTree className="size-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">
                        {category.parentName
                          ? `${dict.categories.subcategoryOf} ${category.parentName}`
                          : dict.categories.rootCategory}
                      </span>
                    </div>
                  </TableCell>

                  {/* Category Key */}
                  <TableCell className="py-3.5">
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700">
                      <KeyRound className="size-3 text-slate-400 shrink-0" />
                      <span>{category.categoryKey || dict.categories.noKey}</span>
                    </span>
                  </TableCell>

                  {/* System / Custom */}
                  <TableCell className="py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
                        category.systemCategory
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {category.systemCategory
                        ? dict.categories.system
                        : dict.categories.custom}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-[#003377] dark:hover:bg-slate-800 dark:hover:text-[#FFC83D] transition"
                        title={dict.common.edit}
                        aria-label={`${dict.common.edit} ${category.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        className="rounded-xl p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 transition"
                        title={dict.common.delete}
                        aria-label={`${dict.common.delete} ${category.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
