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
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | null;
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

// GET /api/v1/admin/users in practice returns { content, page: { number,
// size, totalElements, totalPages } } — the api.ts unwrapPage() helper
// normalizes this (and other shapes seen from this backend) into this flat
// structure, so this type only lists fields the UI actually relies on.
export interface AdminUserPageResponse {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserOnboardingStatus {
  userId: string;
  onboardingCompleted: boolean;
  completedNow: boolean;
}

export interface CreateAdminUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  temporaryPassword: string;
  confirmPassword: string;
  role: "USER" | "ADMIN";
}

export interface AdminCreatedUserResponse {
  profile: AdminUser;
  role: "USER" | "ADMIN";
  temporaryPassword: boolean;
}

export interface UserStatistics {
  totalUsers: number;
  gender: {
    male: number;
    female: number;
    other: number;
    preferNotToSay: number;
    unspecified: number;
  };
  ageGroups: {
    under15: number;
    age15To24: number;
    age25To44: number;
    age45To59: number;
    age60To74: number;
    age75Plus: number;
    unknown: number;
  };
  generatedAt: string;
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
  createdFrom?: string;
  createdTo?: string;
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
