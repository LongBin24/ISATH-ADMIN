// src/api/tags.ts
export const API_TAGS = {
  NOTIFICATION: "Notification",
  PREFERENCES: "Preferences",
  STATS: "Stats",
  USER: "User",
  PROCESS: "Process",
  INACTIVE: "InActive",
  PROFILE: "Profile",
  CURRENCY: "Currency",
  CATEGORY: "Category",
  FEEDBACK: "Feedback",
} as const;

export type ApiTagType = (typeof API_TAGS)[keyof typeof API_TAGS];