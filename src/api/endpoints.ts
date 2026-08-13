export const ENDPOINTS = {
  NOTIFICATIONS: "admin/notifications",
  NOTIFICATION_STATS: "notifications/stats",
  NOTIFICATION_PREFERENCES: "notifications/preferences",
  NOTIFICATION_MARK_READ: "notifications/mark-read",
  NOTIFICATION_MARK_ALL_READ: "notifications/mark-all-read",
  NOTIFICATION_DELETE: "notifications/delete",
  NOTIFICATION_TRIGGER: "notifications/trigger",
  NOTIFICATION_RESET: "notifications/reset",

  // Admin Currencies Endpoints
  ADMIN_CURRENCIES: "admin/currencies",
  ADMIN_CURRENCIES_SYNCHRONIZE: "admin/currencies/synchronize",
  ADMIN_CURRENCIES_PROVIDER_STATUS: "admin/currencies/provider-status",
  ADMIN_CURRENCIES_ACTIVATE: (code: string) => `admin/currencies/${code}/activate`,
  ADMIN_CURRENCIES_DEACTIVATE: (code: string) => `admin/currencies/${code}/deactivate`,

  // Admin Users Endpoints
  ADMIN_USERS: "admin/users",
  ADMIN_USER_BY_ID: (userId: string) => `admin/users/${userId}`,
  ADMIN_USER_ONBOARDING: (userId: string) => `admin/users/${userId}/onboarding`,
  ADMIN_USER_SUSPEND: (userId: string) => `admin/users/${userId}/suspend`,
  ADMIN_USER_REACTIVATE: (userId: string) => `admin/users/${userId}/reactivate`,
} as const;

export const ENDPOINTS_CATEGORY = {
  GET_CATEGORIES: "admin/categories",
  GET_CATEGORY: (id: string) => `admin/categories/${id}`,
  CREATE_CATEGORY: "admin/categories",
  UPDATE_CATEGORY: (id: string) => `admin/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `admin/categories/${id}`,
} as const;
