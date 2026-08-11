export const ENDPOINTS = {
  NOTIFICATIONS: "notifications",
  NOTIFICATION_STATS: "notifications/stats",
  NOTIFICATION_PREFERENCES: "notifications/preferences",
  NOTIFICATION_MARK_READ: "notifications/mark-read",
  NOTIFICATION_MARK_ALL_READ: "notifications/mark-all-read",
  NOTIFICATION_DELETE: "notifications/delete",
  NOTIFICATION_TRIGGER: "notifications/trigger",
  NOTIFICATION_RESET: "notifications/reset",
} as const;

export const ENDPOINTS_CATEGORY = {
  GET_CATEGORIES: "/api/v1/categories",
  GET_CATEGORY: (id: string) => `/api/v1/categories/${id}`,
  CREATE_CATEGORY: "/api/v1/categories",
  UPDATE_CATEGORY: (id: string) => `/api/v1/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/api/v1/categories/${id}`,
  UPDATE_CATEGORY_PREFERENCE: (id: string) =>
    `/api/v1/categories/${id}/preference`,
} as const;
