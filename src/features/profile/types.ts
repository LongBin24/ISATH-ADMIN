export interface UserNotificationSettings {
  email: boolean;
  push: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  weeklyReport: boolean;
  sound: boolean;
}

export type CurrencyCode = "KHR" | "USD" | "EUR" | "THB" | "JPY";

export interface CurrencyOption {
  code: CurrencyCode;
  nameKhmer: string;
  symbol: string;
  rateVsUsd: number; 
  exampleAmount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  isDefaultAvatar: boolean;
  bio: string;
  role: string;
  department: string;
  location: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "inactive" | "pending";
  preferredCurrency: CurrencyCode;
  notifications: UserNotificationSettings;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  bio: string;
  location: string;
  department?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateCurrencyPayload {
  currency: CurrencyCode;
}

export interface UpdateNotificationsPayload {
  notifications: UserNotificationSettings;
}

export interface UploadAvatarPayload {
  avatarUrl: string;
  isDefault?: boolean;
}
