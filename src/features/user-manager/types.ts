export type UserRole = "admin" | "user";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "DELETED" | "INACTIVE" | string;

export interface AdminUser {
  id: string;
  keycloakUserId: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  profileImageUrl: string | null;
  dateOfBirth: string | null;
  occupation: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateProvince: string | null;
  postalCode: string | null;
  countryCode: string | null;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  accountStatus: AccountStatus;
  termsAcceptedAt: string | null;
  privacyPolicyAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface AdminUserPageResponse {
  content: AdminUser[];
  page: PageMetadata;
}

export interface UserOnboardingStatus {
  userId: string;
  onboardingCompleted: boolean;
  completedNow: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface GetUsersQueryParams {
  pageNumber?: number;
  pageSize?: number;
  query?: string;
  search?: string;
  accountStatus?: "ACTIVE" | "SUSPENDED" | "DELETED" | "ALL" | string;
  emailVerified?: boolean;
  onboardingCompleted?: boolean;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

// UI Compatible User type for tables & modals
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  status: "active" | "inactive" | "suspended" | "deleted";
  lastActive: string;
  totalExpenses?: number;
  avatarUrl?: string | null;
  rawUser?: AdminUser;
}
