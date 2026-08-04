import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, DashboardStats, UserSummary ,ProcessSummary} from './type';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['User','Process'],
  endpoints: (builder) => ({
    getStats: builder.query<DashboardStats, void>({
      query: () => 'admin/stats',
    }),
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({ url: 'users', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    getUserSummary: builder.query<UserSummary, void>({
      query: () => 'admin/user/summary',
      providesTags: ['User'],
    }),
    getProcessSummary: builder.query<ProcessSummary, void>({
      query: ( )=> 'admin/process/summary',
      providesTags:['Process'],
    })
  }),
});

export const { useGetStatsQuery, useGetUsersQuery, useCreateUserMutation, useGetUserSummaryQuery ,useGetProcessSummaryQuery} = adminApi;