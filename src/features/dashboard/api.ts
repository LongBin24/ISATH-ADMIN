import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import {
  DashboardStats,
  InActiveSummary,
  ProcessSummary,
  UserSummary,
} from "./type";

type ApiEnvelope<T> = { data: T };
type TransactionPage = { page?: { totalElements?: number }; content?: unknown[] };

const getData = <T,>(response: unknown): T =>
  (response as ApiEnvelope<T>).data ?? (response as T);

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const transRes = await baseQuery("transactions?pageNumber=0&pageSize=1");
        const usersRes = await baseQuery("admin/users?pageNumber=0&pageSize=100");
        const statsRes = await baseQuery(ENDPOINTS.ADMIN_USERS_STATISTICS);

        type UserItem = { accountStatus?: string };
        type UsersEnvelope = { data?: { content?: UserItem[]; totalElements?: number } };
        type StatsEnvelope = { data?: { totalUsers?: number } };

        const transactions = getData<TransactionPage>(transRes.data);
        const usersData = (usersRes.data as UsersEnvelope)?.data;
        const statsData = (statsRes.data as StatsEnvelope)?.data;

        const content = Array.isArray(usersData?.content) ? usersData.content : [];
        const totalUsers = statsData?.totalUsers ?? usersData?.totalElements ?? content.length;
        const inActiveUsers = content.filter((u: UserItem) => u.accountStatus !== "ACTIVE").length;

        return {
          data: {
            totalUsers,
            totalProcess: transactions.page?.totalElements ?? 0,
            inActiveUsers,
          },
        };
      },
      providesTags: ["User"],
    }),
    getUserSummary: builder.query<UserSummary, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const usersRes = await baseQuery("admin/users?pageNumber=0&pageSize=100");
        const statsRes = await baseQuery(ENDPOINTS.ADMIN_USERS_STATISTICS);
        let total = 0;
        let active = 0;
        if (usersRes.data) {
          type UserItem = { accountStatus?: string };
          type UsersEnvelope = { data?: { content?: UserItem[]; totalElements?: number } };
          type StatsEnvelope = { data?: { totalUsers?: number } };

          const usersData = (usersRes.data as UsersEnvelope)?.data;
          const statsData = (statsRes.data as StatsEnvelope)?.data;
          const content = Array.isArray(usersData?.content) ? usersData.content : [];
          total = statsData?.totalUsers ?? usersData?.totalElements ?? content.length;
          active = content.filter((u: UserItem) => u.accountStatus === "ACTIVE").length;
        }
        return {
          data: {
            totalUsers: total,
            totalAdmins: 1,
            totalActiveUsers: active,
            newUsersToday: 0,
          },
        };
      },
      providesTags: ["User"],
    }),
    getProcessSummary: builder.query<ProcessSummary, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery("transactions?pageNumber=0&pageSize=1");
        if (result.error) return { error: result.error };

        const transactions = getData<TransactionPage>(result.data);
        return {
          data: {
            totalProcesses: transactions.page?.totalElements ?? 0,
            totalCompleted: transactions.page?.totalElements ?? 0,
            totalIncome: 0,
            totalExpenses: 0,
          },
        };
      },
    }),
    getInActiveSummary: builder.query<InActiveSummary, void>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const usersRes = await baseQuery("admin/users?pageNumber=0&pageSize=100");
        let inactiveCount = 0;
        if (usersRes.data) {
          type UserItem = { accountStatus?: string };
          type UsersEnvelope = { data?: { content?: UserItem[]; totalElements?: number } };
          const usersData = (usersRes.data as UsersEnvelope)?.data;
          const content = Array.isArray(usersData?.content) ? usersData.content : [];
          inactiveCount = content.filter((u: UserItem) => u.accountStatus !== "ACTIVE").length;
        }
        return {
          data: {
            totalInActive: inactiveCount,
            moreThan30Days: 0,
            moreThan90Days: 0,
            pendingClose: 0,
          },
        };
      },
      providesTags: ["User"],
    }),
  }),
  overrideExisting: true,
});

export {
  useGetUsersQuery,
  useSuspendUserMutation,
  useReactivateUserMutation,
  useCreateUserMutation,
} from "../user-manager/api";

export const {
  useGetStatsQuery,
  useGetUserSummaryQuery,
  useGetProcessSummaryQuery,
  useGetInActiveSummaryQuery,
} = adminApi;
