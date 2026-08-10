import { baseApi } from "@/api/baseApi"; // Import ពី baseApi រួម
import { Category } from "./types";

let MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "អាហារ និងភេសជ្ជៈ",
    icon: "Utensils",
    transactionCount: 45,
    totalBudget: 500,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "2",
    name: "ការទិញទំនិញ",
    icon: "ShoppingBag",
    transactionCount: 18,
    totalBudget: 300,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    name: "វិក្កយបត្រ & ទឹកភ្លើង",
    icon: "Zap",
    transactionCount: 6,
    totalBudget: 200,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "4",
    name: "ការធ្វើដំណើរ",
    icon: "Car",
    transactionCount: 12,
    totalBudget: 150,
    color: "bg-emerald-100 text-emerald-700",
  },
];

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ប្រើ queryFn ដើម្បីធ្វើ Hybrid (ព្យាយាមហៅ API ពិត បើមិនបានប្រើ Mock)
    getCategories: builder.query<Category[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        // ១. ព្យាយាមហៅ API ពិត (ឧទាហរណ៍៖ categories)
        const result = await baseQuery("categories");
        
        if (result.data) {
          return { data: result.data as Category[] };
        }

        // ២. បើ Backend គ្មាន API ទេ ឱ្យបញ្ចេញ Mock ភ្លាម (បាត់ Loading ភ្លាម)
        return { data: MOCK_CATEGORIES };
      },
      providesTags: ["Category" as any],
    }),

    createCategory: builder.mutation<Category, Omit<Category, "id" | "transactionCount">>({
      async queryFn(newCategoryData) {
        await new Promise((res) => setTimeout(res, 300));
        const newCategory = { ...newCategoryData, id: Date.now().toString(), transactionCount: 0 };
        MOCK_CATEGORIES = [newCategory, ...MOCK_CATEGORIES];
        return { data: newCategory as Category };
      },
      invalidatesTags: ["Category" as any],
    }),

    updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
      async queryFn({ id, data }) {
        MOCK_CATEGORIES = MOCK_CATEGORIES.map(c => c.id === id ? { ...c, ...data } : c);
        return { data: MOCK_CATEGORIES.find(c => c.id === id) as Category };
      },
      invalidatesTags: ["Category" as any],
    }),

    deleteCategory: builder.mutation<string, string>({
      async queryFn(id) {
        MOCK_CATEGORIES = MOCK_CATEGORIES.filter(c => c.id !== id);
        return { data: id };
      },
      invalidatesTags: ["Category" as any],
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