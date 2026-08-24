export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuditLogDetail extends AuditLog {
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  userAgent: string | null;
}

export interface AuditLogPage {
  content: AuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface AuditLogQueryParams {
  page?: number;
  pageNumber?: number;
  size?: number;
  pageSize?: number;
  search?: string;
  query?: string;
  action?: string;
  entityType?: string;
  userId?: string;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC" | "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type AuditActionFilter =
  | "ALL"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "SUSPEND"
  | "REACTIVATE"
  | "LOGIN"
  | "LOGOUT";

export type AuditEntityTypeFilter =
  | "ALL"
  | "CONTACT_MESSAGE"
  | "USER"
  | "CATEGORY"
  | "CURRENCY"
  | "ALERT_RULE"
  | "PROMPT_TEMPLATE"
  | "AUTH"
  | "SYSTEM";
