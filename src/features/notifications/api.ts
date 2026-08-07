import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import {
  NotificationItem,
  UserNotificationPreferences,
  NotificationStats,
  TriggerNotificationFormData,
  PreferencesFormData,
} from "./types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationItem[], { category?: string; unreadOnly?: boolean } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category && params.category !== "ALL") {
          queryParams.append("category", params.category);
        }
        if (params?.unreadOnly) {
          queryParams.append("unreadOnly", "true");
        }
        const str = queryParams.toString();
        return `${ENDPOINTS.NOTIFICATIONS}${str ? `?${str}` : ""}`;
      },
      transformResponse: (response: NotificationItem[], _, arg) => {
        let result = response;
        if (arg?.category && arg.category !== "ALL") {
          result = result.filter((n) => n.category === arg.category);
        }
        if (arg?.unreadOnly) {
          result = result.filter((n) => !n.isRead);
        }
        return result;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: API_TAGS.NOTIFICATION, id })),
              { type: API_TAGS.NOTIFICATION, id: "LIST" },
            ]
          : [{ type: API_TAGS.NOTIFICATION, id: "LIST" }],
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      query: () => ENDPOINTS.NOTIFICATION_STATS,
      providesTags: [{ type: API_TAGS.STATS, id: "CURRENT" }],
    }),

    getNotificationPreferences: builder.query<UserNotificationPreferences, void>({
      query: () => ENDPOINTS.NOTIFICATION_PREFERENCES,
      providesTags: [{ type: API_TAGS.PREFERENCES, id: "USER" }],
    }),

    markAsRead: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.NOTIFICATION_MARK_READ}/${id}`,
        method: "PUT",
      }),
      invalidatesTags: [
        { type: API_TAGS.NOTIFICATION, id: "LIST" },
        { type: API_TAGS.STATS, id: "CURRENT" },
      ],
    }),

    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: ENDPOINTS.NOTIFICATION_MARK_ALL_READ,
        method: "PUT",
      }),
      invalidatesTags: [
        { type: API_TAGS.NOTIFICATION, id: "LIST" },
        { type: API_TAGS.STATS, id: "CURRENT" },
      ],
    }),

    deleteNotification: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `${ENDPOINTS.NOTIFICATION_DELETE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: API_TAGS.NOTIFICATION, id: "LIST" },
        { type: API_TAGS.STATS, id: "CURRENT" },
      ],
    }),

    updatePreferences: builder.mutation<UserNotificationPreferences, PreferencesFormData>({
      query: (body) => ({
        url: ENDPOINTS.NOTIFICATION_PREFERENCES,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: API_TAGS.PREFERENCES, id: "USER" }],
    }),

    triggerNotification: builder.mutation<NotificationItem, TriggerNotificationFormData>({
      query: (body) => ({
        url: ENDPOINTS.NOTIFICATION_TRIGGER,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: API_TAGS.NOTIFICATION, id: "LIST" },
        { type: API_TAGS.STATS, id: "CURRENT" },
      ],
    }),

    resetNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: ENDPOINTS.NOTIFICATION_RESET,
        method: "POST",
      }),
      invalidatesTags: [
        { type: API_TAGS.NOTIFICATION, id: "LIST" },
        { type: API_TAGS.STATS, id: "CURRENT" },
        { type: API_TAGS.PREFERENCES, id: "USER" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useGetNotificationPreferencesQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useUpdatePreferencesMutation,
  useTriggerNotificationMutation,
  useResetNotificationsMutation,
} = notificationApi;
