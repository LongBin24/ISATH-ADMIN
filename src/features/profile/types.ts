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
  keycloakUserId: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
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
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "";
  occupation: string;
  addressLine1: string;
  addressLine2: string;
  stateProvince: string;
  postalCode: string;
  countryCode: string;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  termsAcceptedAt: string;
  privacyPolicyAcceptedAt: string;
  updatedAt: string;
  deletedAt: string;
  languageCode: string;
  timezone: string;
  theme: string;
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
  newPassword: string;
  confirmPassword: string;
  passwordConfirmed: boolean;
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
