"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Category } from "../types";
import { useAdminI18n } from "@/i18n/admin-i18n";

interface DeleteCategoryDialogProps {
  category: Category | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryDialog({
  category,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  const { t } = useAdminI18n();

  useEffect(() => {
    if (!category) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isDeleting) onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [category, isDeleting, onClose]);

  if (!category) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-category-title"
        aria-describedby="delete-category-description"
        className="w-full max-w-[400px] rounded-[20px] bg-white p-9 text-center shadow-[0_25px_30px_rgba(0,0,0,0.2)] dark:bg-slate-900 font-google-sans"
      >
        <div className="mx-auto flex size-[60px] items-center justify-center rounded-[30px] bg-red-100">
          <Image
            src="/categories/delete.svg"
            alt=""
            width={26}
            height={26}
          />
        </div>

        <h2
          id="delete-category-title"
          className="mt-4 text-lg font-bold text-[#293444] dark:text-slate-100"
        >
          {t("Delete Category")} {category.name}?
        </h2>
        <p
          id="delete-category-description"
          className="mt-2 text-xs leading-relaxed text-[#667180] dark:text-slate-400"
        >
          {t("This category and associated rules will be removed.")}
        </p>

        <div className="mt-7 flex items-center justify-center gap-2.5">
          <button
            type="button"
            autoFocus
            disabled={isDeleting}
            onClick={onClose}
            className="h-[41px] rounded-[10px] border border-slate-200 bg-[#eaeaea] px-6 text-sm font-bold text-[#293444] transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="h-[41px] min-w-[101px] rounded-[10px] bg-[#ef4444] px-6 text-sm font-bold text-white transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            {isDeleting ? t("Deleting...") : t("Delete Category")}
          </button>
        </div>
      </section>
    </div>
  );
}