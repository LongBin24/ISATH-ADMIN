import { baseApi } from "@/api/baseApi";
import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
  UpdateCurrencyPayload,
  UpdateNotificationsPayload,
  UploadAvatarPayload,
} from "./types";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfilePayload>({
      query: (body) => ({
        url: "profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadAvatar: builder.mutation<UserProfile, UploadAvatarPayload>({
      query: (body) => ({
        url: "profile/avatar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    resetAvatar: builder.mutation<UserProfile, void>({
      query: () => ({
        url: "profile/avatar/reset",
        method: "POST",
      }),
      invalidatesTags: ["Profile"],
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordPayload>({
      query: (body) => ({
        url: "profile/password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateCurrency: builder.mutation<UserProfile, UpdateCurrencyPayload>({
      query: (body) => ({
        url: "profile/currency",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateNotifications: builder.mutation<UserProfile, UpdateNotificationsPayload>({
      query: (body) => ({
        url: "profile/notifications",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useResetAvatarMutation,
  useChangePasswordMutation,
  useUpdateCurrencyMutation,
  useUpdateNotificationsMutation,
} = profileApi;
