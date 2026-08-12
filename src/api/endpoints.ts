export const ENDPOINTS = {
  NOTIFICATIONS: "notifications",
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
} as const;
