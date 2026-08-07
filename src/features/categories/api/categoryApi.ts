import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../types';

let MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'អាហារ និងភេសជ្ជៈ', icon: 'Utensils', transactionCount: 45, totalBudget: 500, color: 'bg-amber-100 text-amber-700' },
  { id: '2', name: 'ការទិញទំនិញ', icon: 'ShoppingBag', transactionCount: 18, totalBudget: 300, color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'វិក្កយបត្រ & ទឹកភ្លើង', icon: 'Zap', transactionCount: 6, totalBudget: 200, color: 'bg-yellow-100 text-yellow-700' },
  { id: '4', name: 'ការធ្វើដំណើរ', icon: 'Car', transactionCount: 12, totalBudget: 150, color: 'bg-emerald-100 text-emerald-700' },
];

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Return a copy to avoid freeze reference issues
        return { data: [...MOCK_CATEGORIES] };
      },
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, Omit<Category, 'id' | 'transactionCount'>>({
      queryFn: async (newCategoryData) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newCategory: Category = {
          ...newCategoryData,
          id: Date.now().toString(),
          transactionCount: 0,
        };
        // ប្រើប្រាស់ Immutable approach ໂດຍการสร้าง Array ថ្មី
        MOCK_CATEGORIES = [newCategory, ...MOCK_CATEGORIES];
        return { data: newCategory };
      },
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
      queryFn: async ({ id, data }) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        let updatedCategory: Category | null = null;

        // ប្រើ .map() ជំនួសការ Assign ផ្ទាល់ ដើម្បីជៀសវាង Read-only error
        MOCK_CATEGORIES = MOCK_CATEGORIES.map((c) => {
          if (c.id === id) {
            updatedCategory = { ...c, ...data };
            return updatedCategory;
          }
          return c;
        });

        if (updatedCategory) {
          return { data: updatedCategory };
        }
        return { error: { status: 404, error: 'Category not found' } };
      },
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<string, string>({
      queryFn: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // ប្រើ .filter() បង្កើត Array ថ្មី
        MOCK_CATEGORIES = MOCK_CATEGORIES.filter((c) => c.id !== id);
        return { data: id };
      },
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;