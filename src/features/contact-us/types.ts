export interface ContactMessage {
  id: string;
  userId: string | null;
  registeredUser: boolean;
  name: string;
  phone: string | null;
  email: string;
  subject: string;
  message?: string;
  messagePreview?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageDetail extends ContactMessage {
  message: string;
}

export interface ContactMessagePage {
  content: ContactMessage[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ContactQueryParams {
  page?: number;
  pageNumber?: number;
  size?: number;
  pageSize?: number;
  search?: string;
  query?: string;
  registeredUser?: boolean;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC" | "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type UserTypeFilter = "ALL" | "REGISTERED" | "GUEST";
export type ContactSortOption = "NEWEST" | "OLDEST" | "NAME";
