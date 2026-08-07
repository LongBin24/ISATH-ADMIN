'use client';

import React, { useState } from 'react';
import { Plus, FolderTree } from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '@/features/categories/api/categoryApi';
import { Category } from '@/features/categories/types';
import { CategoryFormValues } from '@/features/categories/schema';
import { CategoryCard } from '@/features/categories/components/CategoryCard';
import { AddCategoryCard } from '@/features/categories/components/AddCategoryCard';
import { CategoryFormModal } from '@/features/categories/components/CategoryFormModal';

export default function CategoryManagementPage() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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
      await createCategory(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុបប្រភេទនេះមែនទេ?')) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="w-full space-y-8 bg-[#F8F9FA] min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#003377] font-['Hanuman']">
            ប្រភេទ
          </h1>
          <p className="text-slate-500 font-['Hanuman'] mt-1">
            គ្រប់គ្រងប្រភេទចំណាយ
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFC83D] hover:bg-[#f6bd30] text-[#003377] font-bold font-['Hanuman'] shadow-sm transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>ប្រភេទថ្មី</span>
        </button>
      </div>

      {/* Main Grid Layout (grid-cols-1 to grid-cols-4) */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin text-[#003377]">
            <FolderTree className="w-8 h-8" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {/* Add Category Trigger Card */}
          <AddCategoryCard onClick={handleOpenAdd} />

          {/* Mapped Categories */}
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedCategory}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}