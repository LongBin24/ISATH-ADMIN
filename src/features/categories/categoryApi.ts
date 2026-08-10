import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import { Category } from "./types";

let MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "អាហារ",
    icon: "Utensils",
    transactionCount: 45,
    spentAmount: 53.98,
    totalBudget: 450,
    type: "expense",
    color: "bg-amber-100 text-amber-700",
    recentTransactions: [
      { id: "food-1", title: "ទូទាត់", date: "20/07/2026", amount: 5.82 },
      { id: "food-2", title: "ទូទាត់", date: "19/07/2026", amount: 17.2 },
      { id: "food-3", title: "ទូទាត់", date: "18/07/2026", amount: 11.03 },
      { id: "food-4", title: "ទូទាត់", date: "17/07/2026", amount: 11.71 },
      { id: "food-5", title: "ទូទាត់", date: "16/07/2026", amount: 8.22 },
    ],
  },
  {
    id: "2",
    name: "លំនៅដ្ឋាន",
    icon: "House",
    transactionCount: 12,
    spentAmount: 900,
    totalBudget: 900,
    type: "expense",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    id: "3",
    name: "ការដឹកជញ្ជូន",
    icon: "Truck",
    transactionCount: 28,
    spentAmount: 145,
    totalBudget: 200,
    type: "income",
    color: "bg-green-100 text-green-600",
  },
  {
    id: "4",
    name: "កម្សាន្ត",
    icon: "Film",
    transactionCount: 15,
    spentAmount: 180,
    totalBudget: 150,
    type: "income",
    color: "bg-red-100 text-red-500",
  },
  {
    id: "5",
    name: "សុខភាព",
    icon: "Heart",
    transactionCount: 8,
    spentAmount: 60,
    totalBudget: 200,
    type: "expense",
    color: "bg-red-100 text-red-500",
  },
  {
    id: "6",
    name: "កីឡា",
    icon: "Tickets",
    transactionCount: 4,
    spentAmount: 40,
    totalBudget: 100,
    type: "expense",
    color: "bg-emerald-100 text-emerald-500",
  },
  {
    id: "7",
    name: "ដំណើរ",
    icon: "Plane",
    transactionCount: 3,
    spentAmount: 320,
    totalBudget: 400,
    type: "income",
    color: "bg-blue-100 text-blue-500",
  },
  {
    id: "8",
    name: "ការអប់រំ",
    icon: "GraduationCap",
    transactionCount: 6,
    spentAmount: 210,
    totalBudget: 300,
    type: "income",
    color: "bg-orange-100 text-orange-500",
  },
];

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getCategories: builder.query<Category[], void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {

        const result = await baseQuery("categories");
        
        if (result.data) {
          return { data: result.data as Category[] };
        }

        return { data: MOCK_CATEGORIES };
      },
      providesTags: [API_TAGS.CATEGORY],
    }),

    createCategory: builder.mutation<Category, Omit<Category, "id" | "transactionCount">>({
      async queryFn(newCategoryData) {
        await new Promise((res) => setTimeout(res, 300));
        const newCategory = {
          ...newCategoryData,
          id: Date.now().toString(),
          transactionCount: 0,
          spentAmount: 0,
          type: newCategoryData.type ?? "expense",
        };
        MOCK_CATEGORIES = [newCategory, ...MOCK_CATEGORIES];
        return { data: newCategory as Category };
      },
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    updateCategory: builder.mutation<Category, { id: string; data: Partial<Category> }>({
      async queryFn({ id, data }) {
        MOCK_CATEGORIES = MOCK_CATEGORIES.map(c => c.id === id ? { ...c, ...data } : c);
        return { data: MOCK_CATEGORIES.find(c => c.id === id) as Category };
      },
      invalidatesTags: [API_TAGS.CATEGORY],
    }),

    deleteCategory: builder.mutation<string, string>({
      async queryFn(id) {
        MOCK_CATEGORIES = MOCK_CATEGORIES.filter(c => c.id !== id);
        return { data: id };
      },
      invalidatesTags: [API_TAGS.CATEGORY],
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
