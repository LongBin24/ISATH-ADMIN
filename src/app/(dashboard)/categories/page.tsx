"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FolderTree } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categoryApi";
import { Category } from "@/features/categories/types";
import { CategoryFormValues } from "@/features/categories/schema";
import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import { DeleteCategoryDialog } from "@/features/categories/components/DeleteCategoryDialog";

export default function CategoryManagementPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [activeType, setActiveType] = useState<"expense" | "income">(
    "expense",
  );

  const visibleCategories = categories?.filter((category) => {
    const categoryType = (category.type ?? "expense").toLowerCase();

    return categoryType === activeType;
  });

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CategoryFormValues) => {
    if (selectedCategory) {
      await updateCategory({ id: selectedCategory.id, data });
    } else {
      await createCategory({ ...data, type: activeType });
    }
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    const category = categories?.find((item) => item.id === id);
    if (category) setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    await deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  return (
    <div className="min-h-full w-full bg-[#F8F9FA] dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-bold leading-tight text-[#003377] dark:text-slate-100">
            ប្រភេទ
          </h1>
          <p className="mt-0.5 text-base text-slate-500 dark:text-slate-400">
            {visibleCategories?.length ?? 0} ប្រភេទ
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[20px] bg-[#facc15] px-5 py-3 text-[#003377] shadow-[0_2px_3px_rgba(0,0,0,0.14)] transition hover:bg-[#f4c20d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003377] focus-visible:ring-offset-2"
        >
          <Image src="/categories/plus.svg" alt="" width={19} height={19} />
          <span className="text-lg font-bold">ប្រភេទថ្មី</span>
        </button>
      </div>

      <div
        className="mt-[30px] inline-flex rounded-2xl bg-slate-200 p-1 dark:bg-slate-800"
        role="tablist"
        aria-label="ប្រភេទប្រតិបត្តិការ"
      >
        {([
          ["expense", "ប្រភេទចំណាយ"],
          ["income", "ប្រភេទចំណូល"],
        ] as const).map(([value, label]) => {
          const isActive = activeType === value;

          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveType(value)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                isActive
                  ? "bg-slate-50 text-slate-900 shadow-[0_2px_3px_rgba(0,0,0,0.12)] dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin text-[#003377] dark:text-slate-300">
            <FolderTree className="size-8" />
          </div>
        </div>
      ) : visibleCategories?.length ? (
        <div className="mt-[30px] grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onOpen={(selected) => router.push(`/categories/${selected.id}`)}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-[30px] flex min-h-52 flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-white/60 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <FolderTree className="mb-3 size-8 text-slate-400" />
          <p className="font-medium text-[#003377] dark:text-slate-200">
            {activeType === "income"
              ? "មិនទាន់មានប្រភេទចំណូលទេ"
              : "មិនទាន់មានប្រភេទចំណាយទេ"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            ចុច “ប្រភេទថ្មី” ដើម្បីបង្កើតប្រភេទថ្មី
          </p>
        </div>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        isLoading={isCreating || isUpdating}
      />
      <DeleteCategoryDialog
        category={categoryToDelete}
        isDeleting={isDeleting}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
