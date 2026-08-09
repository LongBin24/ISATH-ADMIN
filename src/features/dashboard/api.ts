import { baseApi } from "@/api/baseApi";
import {
  User,
  DashboardStats,
  UserSummary,
  ProcessSummary,
  InActiveSummary,
} from "./type";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      // query: () => "admin/stats",
       async queryFn() {
        return { data: { totalUsers: 2, totalTransactions: 48291, inactiveCount: 1 } as any };
       }
    }),
    getUsers: builder.query<User[], void>({
      // query: () => "users",
      // providesTags: ["User"],
      
      async queryFn() {
        return { data: { count: 2, label: "អ្នកប្រើប្រាស់សរុប" } as any };
      },
      providesTags: ["User"],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    getUserSummary: builder.query<any, void>({
      async queryFn() {
        return { data: { count: 2, label: "អ្នកប្រើប្រាស់សរុប" } };
      },
    }),
    getProcessSummary: builder.query<any, void>({
      async queryFn() {
        return { data: { count: 48291, label: "ប្រតិបត្តិការសរុប" } };
      },
    }),
    getInActiveSummary: builder.query<any, void>({
      async queryFn() {
        return { data: { count: 1, label: "មិនសកម្ម" } };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserSummaryQuery,
  useGetProcessSummaryQuery,
  useGetInActiveSummaryQuery,
} = adminApi;
