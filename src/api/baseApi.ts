import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_TAGS } from "./tags";
import { INITIAL_NOTIFICATIONS, INITIAL_PREFERENCES } from "@/features/notifications/constants";
import {
  NotificationItem,
  UserNotificationPreferences,
  NotificationStats,
  NotificationCategory,
  TriggerNotificationFormData,
} from "@/features/notifications/types";

// In-memory store for client-side state interactive persistence
let mockNotificationsState: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let mockPreferencesState: UserNotificationPreferences = { ...INITIAL_PREFERENCES };

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    fetchFn: async (input, init) => {
      const urlStr = typeof input === "string" ? input : input.url;
      const method = init?.method || "GET";

      // Subtle latency simulation
      await new Promise((resolve) => setTimeout(resolve, 250));

      if (urlStr.includes("notifications/stats")) {
        const stats: NotificationStats = {
          total: mockNotificationsState.length,
          unreadCount: mockNotificationsState.filter((n) => !n.isRead).length,
          byCategory: {
            DAILY_EXPENSE: mockNotificationsState.filter((n) => n.category === "DAILY_EXPENSE").length,
            BUDGET_WARNING: mockNotificationsState.filter((n) => n.category === "BUDGET_WARNING").length,
            SAVINGS_GOAL: mockNotificationsState.filter((n) => n.category === "SAVINGS_GOAL").length,
            RECURRING_TX: mockNotificationsState.filter((n) => n.category === "RECURRING_TX").length,
            MONTHLY_SUMMARY: mockNotificationsState.filter((n) => n.category === "MONTHLY_SUMMARY").length,
          },
          byChannel: {
            IN_APP: mockNotificationsState.filter((n) => n.channels.includes("IN_APP")).length,
            EMAIL: mockNotificationsState.filter((n) => n.channels.includes("EMAIL")).length,
          },
        };
        return new Response(JSON.stringify(stats), { status: 200 });
      }

      if (urlStr.includes("notifications/preferences")) {
        if (method === "PUT" || method === "POST") {
          const body = JSON.parse(init?.body as string);
          mockPreferencesState = { ...mockPreferencesState, ...body };
          return new Response(JSON.stringify(mockPreferencesState), { status: 200 });
        }
        return new Response(JSON.stringify(mockPreferencesState), { status: 200 });
      }

      if (urlStr.includes("notifications/mark-all-read")) {
        mockNotificationsState = mockNotificationsState.map((n) => ({ ...n, isRead: true }));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (urlStr.includes("notifications/mark-read/")) {
        const id = urlStr.split("notifications/mark-read/")[1];
        mockNotificationsState = mockNotificationsState.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        return new Response(JSON.stringify({ success: true, id }), { status: 200 });
      }

      if (urlStr.includes("notifications/delete/")) {
        const id = urlStr.split("notifications/delete/")[1];
        mockNotificationsState = mockNotificationsState.filter((n) => n.id !== id);
        return new Response(JSON.stringify({ success: true, id }), { status: 200 });
      }

      if (urlStr.includes("notifications/trigger")) {
        const body: TriggerNotificationFormData = JSON.parse(init?.body as string);
        const channels: ("IN_APP" | "EMAIL")[] =
          body.channel === "BOTH"
            ? ["IN_APP", "EMAIL"]
            : body.channel === "EMAIL"
            ? ["EMAIL"]
            : ["IN_APP"];

        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          titleKh: body.customTitleKh || "ការជូនដំណឹង",
          titleEn: body.category ? body.category.replace("_", " ") : "Notification",
          messageKh: body.customMessageKh || "",
          messageEn: body.customMessageKh || "",
          category: (body.category as NotificationCategory) || "DAILY_EXPENSE",
          channels,
          priority: body.priority || "MEDIUM",
          isRead: false,
          createdAt: new Date().toISOString(),
          metadata: {
            amount: typeof body.amount === "number" && !isNaN(body.amount) ? body.amount : undefined,
            savingsGoalName: body.targetName || undefined,
          },
        };

        mockNotificationsState = [newNotif, ...mockNotificationsState];
        return new Response(JSON.stringify(newNotif), { status: 201 });
      }

      if (urlStr.includes("notifications/reset")) {
        mockNotificationsState = [...INITIAL_NOTIFICATIONS];
        mockPreferencesState = { ...INITIAL_PREFERENCES };
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      if (urlStr.includes("notifications")) {
        return new Response(JSON.stringify(mockNotificationsState), { status: 200 });
      }

      return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
    },
  }),
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
});
