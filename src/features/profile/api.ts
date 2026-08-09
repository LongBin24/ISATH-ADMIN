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
  async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
  
    const result = await baseQuery("profile"); 

    if (result.data) {
      console.log("✅ Profile ទាញបានពី Backend ពិត");
      return { data: result.data as UserProfile };
    }
    return { 
      data: {
        id: "admin-001",
        name: "ចាន់ សុផា",        
        email: "admin@istash.com",
        role: "ADMIN",
        avatar: "https://ui-avatars.com/api/?name=Chan+Sopha&background=003377&color=fff",
      } as UserProfile 
    };
  },
  providesTags: ["Profile" as any],
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
