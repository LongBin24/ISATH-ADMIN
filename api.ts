import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AlertRule } from "./types";
import type { RootState } from "./store";

// A custom base query to handle authentication headers.
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // This assumes your auth state and token are in the Redux store.
    // Adapt this to your actual token storage mechanism (e.g., next-auth `getSession`).
    const token = (getState() as RootState).auth?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const alertRulesApi = createApi({
  reducerPath: "alertRulesApi",
  baseQuery: baseQuery,
  tagTypes: ["AlertRule"],
  endpoints: (builder) => ({
    getAlertRules: builder.query<
      AlertRule[],
      { search?: string; severity?: string; status?: string } | void
    >({
      query: (params) => ({
        url: "admin/alert-rules",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "AlertRule" as const, id })),
              { type: "AlertRule", id: "LIST" },
            ]
          : [{ type: "AlertRule", id: "LIST" }],
    }),
    getAlertRuleById: builder.query<AlertRule, string>({
      query: (ruleId) => `admin/alert-rules/${ruleId}`,
      providesTags: (result, error, id) => [{ type: "AlertRule", id }],
    }),
  }),
});

export const {
  useGetAlertRulesQuery,
  useGetAlertRuleByIdQuery,
  useLazyGetAlertRuleByIdQuery,
} = alertRulesApi;
