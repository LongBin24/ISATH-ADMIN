import { ENDPOINTS_CATEGORY } from "@/api/endpoints";
import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import { Category, CategoryTransaction } from "./types";

export type CreateCategoryPayload = {
  parentId?: string;
  name: string;
  type: "expense" | "income";
  icon: string;
  color: string;
  systemCategory: boolean;
  categoryKey?: string;
  defaultCategory: boolean;
};
export type UpdateCategoryPayload = {
  name?: string;
  categoryType?: "INCOME" | "EXPENSE" | "BOTH";
  parentId?: string;
  moveToRoot?: boolean;
  icon?: string;
  color?: string;
  defaultCategory?: boolean;
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
};

export type CategoryQueryParams = {
  parentId?: string;
  type?: "INCOME" | "EXPENSE" | "BOTH";
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
  defaultCategory?: boolean;
  systemCategory?: boolean;
  rootOnly?: boolean;
  keyword?: string;
  includeHidden?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
};

export type AdminCategoryPage = CategoryPage;

export type AdminCreateCategoryPayload = {
  parentId?: string;
  name: string;
  categoryType: "INCOME" | "EXPENSE" | "BOTH";
  icon?: string;
  color?: string;
  systemCategory?: boolean;
  categoryKey?: string;
  defaultCategory?: boolean;
};

type CreateCategoryRequest = {
  parentId?: string;
  name: string;
  categoryType: "INCOME" | "EXPENSE";
  icon: string;
  color: string;
  systemCategory: boolean;
  categoryKey: string;
  defaultCategory: boolean;
};

type RecordValue = Record<string, unknown>;

type CategoryPage = {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

const asRecord = (value: unknown): RecordValue =>
  typeof value === "object" && value !== null ? (value as RecordValue) : {};

const asNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const unwrapData = (response: unknown): unknown => {
  const record = asRecord(response);
  return "data" in record ? record.data : response;
};

const createCategoryKey = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomValues = new Uint8Array(16);
  globalThis.crypto.getRandomValues(randomValues);

  const suffix = Array.from(
    randomValues,
    (value) => alphabet[value % alphabet.length],
  ).join("");

  const firstValue = new Uint8Array(1);
  globalThis.crypto.getRandomValues(firstValue);

  return `${letters[firstValue[0] % letters.length]}${suffix}`;
};

const toCreateCategoryRequest = (
  payload: CreateCategoryPayload,
): CreateCategoryRequest => ({
  ...(payload.parentId ? { parentId: payload.parentId } : {}),
  name: payload.name,
  categoryType: payload.type === "income" ? "INCOME" : "EXPENSE",
  icon: payload.icon,
  color: payload.color,
  systemCategory: payload.systemCategory,
  categoryKey: payload.categoryKey || createCategoryKey(),
  defaultCategory: payload.systemCategory && payload.defaultCategory,
});

const normalizeTransaction = (
  value: unknown,
  index: number,
): CategoryTransaction => {
  const record = asRecord(value);

  return {
    id: String(record.id ?? record.transactionId ?? index),
    title: String(record.title ?? record.description ?? record.name ?? "ប្រតិបត្តិការ"),
    date: String(record.date ?? record.transactionDate ?? record.createdAt ?? ""),
    amount: asNumber(record.amount ?? record.totalAmount),
  };
};

const normalizeCategory = (value: unknown): Category => {
  const record = asRecord(value);
  const preference = asRecord(record.preference ?? record.categoryPreference);
  const rawType = String(record.type ?? record.categoryType ?? "expense").toLowerCase();
  const rawTransactions =
    record.recentTransactions ?? record.transactions ?? preference.recentTransactions;

  return {
    id: String(record.id ?? record.categoryId ?? ""),
    parentId: typeof record.parentId === "string" ? record.parentId : null,
    parentName:
      typeof record.parentName === "string" ? record.parentName : null,
    userId: typeof record.userId === "string" ? record.userId : null,
    categoryKey:
      typeof record.categoryKey === "string" ? record.categoryKey : undefined,
    name: String(record.name ?? record.categoryName ?? ""),
    icon: String(record.icon ?? preference.icon ?? "Box"),
    transactionCount: asNumber(
      record.transactionCount ?? record.totalTransactions ?? record.transaction_count,
    ),
    totalBudget: asNumber(
      record.totalBudget ?? record.budget ?? preference.totalBudget ?? preference.budget,
    ),
    spentAmount: asNumber(
      record.spentAmount ?? record.totalSpent ?? record.totalAmount ?? record.amount,
    ),
    type: rawType === "income" ? "income" : rawType === "both" ? "both" : "expense",
    color: String(record.color ?? preference.color ?? "#3b82f6"),
    defaultCategory: Boolean(record.defaultCategory),
    status: record.status === "INACTIVE" ? "INACTIVE" : record.status === "DELETED" ? "DELETED" : "ACTIVE",
    systemCategory: Boolean(record.systemCategory),
    ownedByCurrentUser:
      typeof record.ownedByCurrentUser === "boolean"
        ? record.ownedByCurrentUser
        : undefined,
    hiddenForCurrentUser:
      typeof record.hiddenForCurrentUser === "boolean"
        ? record.hiddenForCurrentUser
        : undefined,
    deletedAt:
      typeof record.deletedAt === "string" ? record.deletedAt : null,
    createdAt:
      typeof record.createdAt === "string" ? record.createdAt : undefined,
    updatedAt:
      typeof record.updatedAt === "string" ? record.updatedAt : undefined,
    recentTransactions: Array.isArray(rawTransactions)
      ? rawTransactions.map(normalizeTransaction)
      : undefined,
  };
};

const normalizeCategoryList = (response: unknown): Category[] => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) return payload.map(normalizeCategory);

  const record = asRecord(payload);
  const categories = record.content ?? record.items ?? record.categories;

  return Array.isArray(categories) ? categories.map(normalizeCategory) : [];
};

const normalizeCategoryPage = (response: unknown): CategoryPage => {
  const record = asRecord(unwrapData(response));
  const content = Array.isArray(record.content)
    ? record.content.map(normalizeCategory)
    : [];

  return {
    content,
    pageNumber: asNumber(record.pageNumber),
    pageSize: asNumber(record.pageSize, content.length),
    totalElements: asNumber(record.totalElements, content.length),
    totalPages: asNumber(record.totalPages, 1),
    first: Boolean(record.first),
    last: Boolean(record.last),
  };
};

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: ENDPOINTS_CATEGORY.GET_CATEGORIES,
        method: "GET",
      }),
      transformResponse: normalizeCategoryList,
      providesTags: (result) => [
        { type: API_TAGS.CATEGORY, id: "LIST" },
        ...(result?.map((category) => ({
          type: API_TAGS.CATEGORY,
          id: category.id,
        })) ?? []),
      ],
    }),

    getAdminCategories: builder.query<AdminCategoryPage, CategoryQueryParams>({
      query: (params) => ({
        url: ENDPOINTS_CATEGORY.GET_CATEGORIES,
        method: "GET",
        params,
      }),
      transformResponse: normalizeCategoryPage,
      providesTags: (result) => [
        { type: API_TAGS.CATEGORY, id: "LIST" },
        ...(result?.content.map((category) => ({ type: API_TAGS.CATEGORY, id: category.id })) ?? []),
      ],
    }),

    getCategoriesPaginated: builder.infiniteQuery<
      CategoryPage,
      void,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          lastPage.last ? undefined : lastPage.pageNumber + 1,
      },
      query: ({ pageParam }) => ({
        url: ENDPOINTS_CATEGORY.GET_CATEGORIES,
        method: "GET",
        params: {
          pageNumber: pageParam,
          pageSize: 12,
        },
      }),
      transformResponse: normalizeCategoryPage,
      providesTags: (result) => [
        { type: API_TAGS.CATEGORY, id: "LIST" },
        ...(result?.pages.flatMap((page) =>
          page.content.map((category) => ({
            type: API_TAGS.CATEGORY,
            id: category.id,
          })),
        ) ?? []),
      ],
    }),

    createCategory: builder.mutation<Category, CreateCategoryPayload>({
      query: (payload) => ({
        url: ENDPOINTS_CATEGORY.CREATE_CATEGORY,
        method: "POST",
        body: toCreateCategoryRequest(payload),
      }),
      transformResponse: (response: unknown) =>
        normalizeCategory(unwrapData(response)),
      invalidatesTags: [{ type: API_TAGS.CATEGORY, id: "LIST" }],
    }),

    createAdminCategory: builder.mutation<Category, AdminCreateCategoryPayload>({
      query: (payload) => ({
        url: ENDPOINTS_CATEGORY.CREATE_CATEGORY,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: unknown) => normalizeCategory(unwrapData(response)),
      invalidatesTags: [{ type: API_TAGS.CATEGORY, id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryPayload }
    >({
      query: ({ id, data }) => ({
        url: ENDPOINTS_CATEGORY.UPDATE_CATEGORY(id),
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedCategory } = await queryFulfilled;

          dispatch(
            categoryApi.util.updateQueryData(
              "getCategoriesPaginated",
              undefined,
              (draft) => {
                for (const page of draft.pages) {
                  const index = page.content.findIndex(
                    (category) => category.id === id,
                  );

                  if (index !== -1) {
                    page.content[index] = updatedCategory;
                    break;
                  }
                }
              },
            ),
          );
        } catch {
          // The mutation error is handled by the calling page.
        }
      },
      transformResponse: (response: unknown) =>
        normalizeCategory(unwrapData(response)),
      invalidatesTags: (_result, _error, { id }) => [
        { type: API_TAGS.CATEGORY, id },
        { type: API_TAGS.CATEGORY, id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: ENDPOINTS_CATEGORY.DELETE_CATEGORY(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: API_TAGS.CATEGORY, id },
        { type: API_TAGS.CATEGORY, id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCategoriesQuery,
  useGetAdminCategoriesQuery,
  useGetCategoriesPaginatedInfiniteQuery,
  useCreateCategoryMutation,
  useCreateAdminCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
