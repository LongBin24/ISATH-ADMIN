export type SearchItemType =
  | "USER"
  | "CATEGORY"
  | "CURRENCY"
  | "REVIEW"
  | "ALERT_RULE"
  | "NOTIFICATION";

export interface AdminSearchItemResponse {
  id: string;
  title: string;
  subtitle: string;
  type: SearchItemType | string;
  [key: string]: unknown;
}

export interface AdminSearchGroupsResponse {
  alertRules: AdminSearchItemResponse[];
  categories: AdminSearchItemResponse[];
  currencies: AdminSearchItemResponse[];
  notifications: AdminSearchItemResponse[];
  reviews: AdminSearchItemResponse[];
  users: AdminSearchItemResponse[];
}

export interface AdminSearchResponse {
  groups: AdminSearchGroupsResponse;
  query: string;
  totalResults: number;
}

export interface ApiResponseSearch {
  data: AdminSearchResponse;
  message: string;
  success: boolean;
  timestamp?: string;
}

export interface SearchQueryParams {
  q?: string;
  query?: string;
  limit?: number;
  [key: string]: unknown;
}

export type SearchGroupType =
  | "all"
  | "users"
  | "categories"
  | "currencies"
  | "reviews"
  | "alertRules"
  | "notifications";

// Backward compatibility aliases
export type SearchResultData = AdminSearchResponse;
export type SearchGroups = AdminSearchGroupsResponse;
export type SearchItem = AdminSearchItemResponse;
export type SearchUserItem = AdminSearchItemResponse;
export type SearchCategoryItem = AdminSearchItemResponse;
export type SearchCurrencyItem = AdminSearchItemResponse;
export type SearchReviewItem = AdminSearchItemResponse;
export type SearchAlertRuleItem = AdminSearchItemResponse;
export type SearchNotificationItem = AdminSearchItemResponse;
