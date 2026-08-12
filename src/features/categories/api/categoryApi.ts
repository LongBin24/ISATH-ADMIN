import { baseApi } from "@/api/baseApi";
import { Category } from "../types";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "admin/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, Omit<Category, "id" | "transactionCount">>({
      query: (body) => ({
        url: "admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
      query: ({ id, data }) => ({
        url: `admin/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<string, string>({
      query: (id) => ({
        url: `admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;