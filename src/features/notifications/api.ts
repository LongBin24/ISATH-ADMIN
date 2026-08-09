// import { baseApi } from "@/api/baseApi";
// import { ENDPOINTS } from "@/api/endpoints";
// import { API_TAGS } from "@/api/tags";
// import { NotificationItem, NotificationResponse, NotificationStats, UserNotificationPreferences } from "./types";

// export const notificationApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getNotifications: builder.query<NotificationItem[], any>({
//       query: () => "/admin/notifications?pageNumber=0&pageSize=20",
//       transformResponse: (res: NotificationResponse) => {
//         return res.content.map(item => ({
//           ...item,
//           isRead: item.read,
//           titleKh: item.title,
//           messageKh: item.message
//         }));
//       },
//       providesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
//     }),

//     getNotificationStats: builder.query<NotificationStats, void>({
//       async queryFn() {
//         return { data: { total: 5, unreadCount: 2, byCategory: {} as any, byChannel: {} as any } };
//       },
//       providesTags: [{ type: API_TAGS.STATS as any, id: "CURRENT" }],
//     }),

//     getNotificationPreferences: builder.query<UserNotificationPreferences, void>({
//       async queryFn() {
//         return { data: { email: "user@example.com", quietHoursEnabled: false, digestFrequency: "DAILY", categories: [] } as any };
//       },
//     }),

//     // Mutations
//     markAsRead: builder.mutation<any, string>({
//       query: (id) => ({ url: `/admin/notifications/${id}`, method: "PATCH" }),
//       invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
//     }),
    
//     markAllAsRead: builder.mutation<any, void>({
//       query: () => ({ url: "/admin/notifications/mark-all-read", method: "PUT" }),
//       invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
//     }),

//     deleteNotification: builder.mutation<any, string>({
//       query: (id) => ({ url: `/admin/notifications/${id}`, method: "DELETE" }),
//       invalidatesTags: [{ type: API_TAGS.NOTIFICATION as any, id: "LIST" }],
//     }),
//   }),
// });

// export const {
//   useGetNotificationsQuery,
//   useGetNotificationStatsQuery,
//   useGetNotificationPreferencesQuery,
//   useMarkAsReadMutation,
//   useMarkAllAsReadMutation,
//   useDeleteNotificationMutation,
// } = notificationApi;


import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { 
  NotificationItem, 
  NotificationStats, 
  UserNotificationPreferences 
} from "./types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationItem[], any>({
      async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        const result = await baseQuery(`${ENDPOINTS.NOTIFICATIONS}?pageNumber=0&pageSize=20`);
        const content = (result.data as any)?.content || [];
        
        // Mapping ឱ្យគ្រប់គ្រប់ Key ទាំងចាស់ទាំងថ្មី
        const mapped = content.map((item: any) => ({
          ...item,
          isRead: item.read,
          category: item.notificationType || "DAILY_REMINDER",
          titleKh: item.title || "",
          titleEn: item.title || "",
          messageKh: item.message || "",
          messageEn: item.message || "",
          channels: ["IN_APP"],
          priority: "MEDIUM"
        }));
        return { data: mapped };
      },
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      async queryFn() { return { data: { total: 0, unreadCount: 0, byCategory: {}, byChannel: {} } as any }; }
    }),

    getNotificationPreferences: builder.query<UserNotificationPreferences, void>({
      async queryFn() { return { data: { email: "", quietHoursEnabled: false, categories: [] } as any }; }
    }),

    // --- Mutations ត្រូវដាក់ឈ្មោះឱ្យត្រូវតាម UI បងប្អូន ---
    markAsRead: builder.mutation<any, string>({
      query: (id) => ({ url: `${ENDPOINTS.NOTIFICATIONS}/${id}`, method: "PATCH" })
    }),
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({ url: "/api/v1/admin/notifications/mark-all-read", method: "PUT" })
    }),
    deleteNotification: builder.mutation<any, string>({
      query: (id) => ({ url: `${ENDPOINTS.NOTIFICATIONS}/${id}`, method: "DELETE" })
    }),
    updatePreferences: builder.mutation<any, any>({
      async queryFn() { return { data: {} }; }
    }),
    triggerNotification: builder.mutation<any, any>({
      async queryFn() { return { data: {} }; }
    }),
    resetNotifications: builder.mutation<any, void>({
      async queryFn() { return { data: {} }; }
    }),
  }),
});

// Export ឱ្យគ្រប់ឈ្មោះដែល UI ចង់បាន
export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useGetNotificationPreferencesQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useUpdatePreferencesMutation,
  useTriggerNotificationMutation, // ឈ្មោះនេះហើយដែលបាត់មិញ
  useResetNotificationsMutation,
} = notificationApi;