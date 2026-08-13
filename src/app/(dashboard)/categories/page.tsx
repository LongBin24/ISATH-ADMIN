"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FolderTree } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetCategoriesPaginatedInfiniteQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type UpdateCategoryPayload,
} from "@/features/categories/categoryApi";
import { Category } from "@/features/categories/types";
import { CategoryFormValues } from "@/features/categories/schema";
import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import { DeleteCategoryDialog } from "@/features/categories/components/DeleteCategoryDialog";

const API_ERROR_TRANSLATIONS: Record<string, string> = {
  "Category cannot be deleted while it has non-deleted subcategories.":
    "មិនអាចលុបប្រភេទនេះបានទេ ដោយសារវានៅមានប្រភេទរងដែលមិនទាន់បានលុប។",
  "The category type is incompatible with an existing subcategory.":
    "មិនអាចប្តូរប្រភេទនេះបានទេ ព្រោះវាមិនត្រូវគ្នាជាមួយប្រភេទរងដែលមានស្រាប់។",
};

const CATEGORY_HAS_CHILDREN_MESSAGE =
  "មិនអាចលុបប្រភេទនេះបានទេ ដោយសារវានៅមានប្រភេទរងដែលមិនទាន់បានលុប។";

const getApiErrorMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("data" in error)) {
    return "មិនអាចបំពេញសំណើបានទេ។";
  }

  const data = (error as { data: unknown }).data;

  if (typeof data === "object" && data !== null) {
    const response = data as {
      message?: unknown;
      fieldErrors?: unknown;
    };

    if (Array.isArray(response.fieldErrors) && response.fieldErrors.length) {
      const fieldMessages = response.fieldErrors
        .map((fieldError) => {
          if (typeof fieldError === "string") return fieldError;
          if (typeof fieldError !== "object" || fieldError === null) return null;

          const record = fieldError as { field?: unknown; message?: unknown };
          if (typeof record.message !== "string") return null;

          return typeof record.field === "string"
            ? `${record.field}: ${record.message}`
            : record.message;
        })
        .filter((message): message is string => Boolean(message));

      if (fieldMessages.length) return fieldMessages.join(" · ");
    }

    if (typeof response.message === "string") {
      return API_ERROR_TRANSLATIONS[response.message] ?? response.message;
    }
  }

  return "មិនអាចបំពេញសំណើបានទេ។";
};

export default function CategoryManagementPage() {
  const {
    data: categoryPages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCategoriesPaginatedInfiniteQuery();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const categories = useMemo(
    () => categoryPages?.pages.flatMap((page) => page.content) ?? [],
    [categoryPages],
  );
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
  const [activeType, setActiveType] = useState<"expense" | "income">("expense");

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    try {
      if (selectedCategory) {
        const previousParentId = selectedCategory.parentId ?? null;
        const nextParentId = data.parentId ?? null;
        const hierarchyChanged = previousParentId !== nextParentId;
        const previousType =
          selectedCategory.type === "income" ? "INCOME" : "EXPENSE";
        const nextType = data.type === "income" ? "INCOME" : "EXPENSE";
        const previousColor = selectedCategory.color ?? "#3b82f6";
        const updateData: UpdateCategoryPayload = {};

        if (data.name.trim() !== selectedCategory.name) {
          updateData.name = data.name.trim();
        }
        if (nextType !== previousType) updateData.categoryType = nextType;
        if (data.icon !== selectedCategory.icon) updateData.icon = data.icon;
        if (data.color !== previousColor) updateData.color = data.color;

        if (hierarchyChanged) {
          if (nextParentId) updateData.parentId = nextParentId;
          else updateData.moveToRoot = true;
        }

        if (Object.keys(updateData).length === 0) {
          toast("មិនមានការផ្លាស់ប្តូរសម្រាប់រក្សាទុកទេ។");
          return;
        }

        await updateCategory({
          id: selectedCategory.id,
          data: updateData,
        }).unwrap();
        toast.success("បានកែសម្រួលប្រភេទដោយជោគជ័យ។");
      } else {
        await createCategory({
          parentId: data.parentId ?? undefined,
          name: data.name,
          type: data.type,
          icon: data.icon,
          color: data.color,
          systemCategory: data.systemCategory,
          categoryKey: data.categoryKey || undefined,
          defaultCategory: data.defaultCategory,
        }).unwrap();
        toast.success("បានបង្កើតប្រភេទដោយជោគជ័យ។");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleOpenDelete = (category: Category) => {
    const hasActiveSubcategories = categories.some(
      (item) => item.parentId === category.id && !item.deletedAt,
    );

    if (hasActiveSubcategories) {
      toast.error(CATEGORY_HAS_CHILDREN_MESSAGE, {
        id: `category-delete-${category.id}`,
      });
      return;
    }

    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      setCategoryToDelete(null);
      toast.success("បានលុបប្រភេទដោយជោគជ័យ។");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
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
        {(
          [
            ["expense", "ប្រភេទចំណាយ"],
            ["income", "ប្រភេទចំណូល"],
          ] as const
        ).map(([value, label]) => {
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

      <div ref={loadMoreRef} className="flex h-16 items-center justify-center">
        {isFetchingNextPage && (
          <FolderTree className="size-6 animate-spin text-[#003377] dark:text-slate-300" />
        )}
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        categories={categories}
        defaultType={activeType}
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
