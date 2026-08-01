import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User, DashboardStats } from './type';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1' }),
  tagTypes: ['User'],
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
  }),
});

export const { useGetStatsQuery, useGetUsersQuery, useCreateUserMutation } = adminApi;