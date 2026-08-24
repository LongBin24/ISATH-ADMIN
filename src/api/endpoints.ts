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
  ADMIN_USERS_STATISTICS: "admin/users/statistics",
  ADMIN_USER_BY_ID: (userId: string) => `admin/users/${userId}`,
  ADMIN_USER_ONBOARDING: (userId: string) => `admin/users/${userId}/onboarding`,
  ADMIN_USER_SUSPEND: (userId: string) => `admin/users/${userId}/suspend`,
  ADMIN_USER_REACTIVATE: (userId: string) => `admin/users/${userId}/reactivate`,

  // Admin Contact Us Endpoints
  ADMIN_CONTACT_US: "admin/contact-us",
  ADMIN_CONTACT_US_BY_ID: (id: string) => `admin/contact-us/${id}`,

  // Admin Audit Logs Endpoints
  ADMIN_AUDIT_LOGS: "admin/audit-logs",
  ADMIN_AUDIT_LOGS_BY_ID: (id: string) => `admin/audit-logs/${id}`,
  ADMIN_AUDIT_LOGS_BY_USER: (userId: string) => `admin/audit-logs/users/${userId}`,
  ADMIN_AUDIT_LOGS_BY_ENTITY: (entityType: string, entityId: string) =>
    `admin/audit-logs/entities/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`,
} as const;

export const ENDPOINTS_CATEGORY = {
  GET_CATEGORIES: "admin/categories",
  GET_CATEGORY: (id: string) => `admin/categories/${id}`,
  CREATE_CATEGORY: "admin/categories",
  UPDATE_CATEGORY: (id: string) => `admin/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `admin/categories/${id}`,
} as const;

export const ENDPOINTS_PROMPT_TEMPLATE = {
  PROMPT_TEMPLATES: "admin/ai/prompt-templates",
  PROMPT_TEMPLATE_BY_ID: (templateId: string) => `admin/ai/prompt-templates/${templateId}`,
  PROMPT_TEMPLATE_UPDATE: (templateId: string) => `admin/ai/prompt-templates/${templateId}`, // PATCH
  UPDATE_PROMPT_TEMPLATE: (templateId: string) => `admin/ai/prompt-templates/${templateId}`, // PATCH alias
  PROMPT_TEMPLATE_VERSIONS: (templateId: string) => `admin/ai/prompt-templates/${templateId}/versions`,
  PROMPT_TEMPLATE_TEST: (templateId: string) => `admin/ai/prompt-templates/${templateId}/test`,
  PROMPT_TEMPLATE_SET_DEFAULT: (templateId: string) => `admin/ai/prompt-templates/${templateId}/set-default`,
  PROMPT_TEMPLATE_ARCHIVE: (templateId: string) => `admin/ai/prompt-templates/${templateId}/archive`,
  PROMPT_TEMPLATE_ACTIVATE: (templateId: string) => `admin/ai/prompt-templates/${templateId}/activate`,
} as const;

