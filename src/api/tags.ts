export const API_TAGS = {
  NOTIFICATION: "Notification",
  PREFERENCES: "Preferences",
  STATS: "Stats",
  USER: "User",
  PROCESS: "Process",
  INACTIVE: "InActive",
<<<<<<< HEAD
  PROFILE: "Profile",
  CURRENCY: "Currency",
  CATEGORY: "Category"
=======
  PROFILE: 'Profile',
  CURRENCY: 'Currency',
  CATEGORY: 'Category',
  FEEDBACK: 'Feedback',
>>>>>>> feature/admin-api-integration
} as const;

export type ApiTagType = (typeof API_TAGS)[keyof typeof API_TAGS];
