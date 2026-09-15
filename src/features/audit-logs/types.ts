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

// Base list: userId, action, entityType, entityId, createdFrom, createdTo, page, size, sortBy, sortDirection.
// User history omits userId/entityId (covered by the path); entity history takes only page/size.
// action/entityType are matched case-insensitively but only as an exact match — no partial search.
// createdFrom is inclusive, createdTo is exclusive (ISO-8601 instants).
export interface AuditLogQueryParams {
  page?: number;
  size?: number;
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  createdFrom?: string;
  createdTo?: string;
  sortBy?: "createdAt" | "action" | "entityType";
  sortDirection?: "ASC" | "DESC";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// action/entityType are free-form strings on the backend, not a closed enum — this is a
// current snapshot of the known values, used to populate filter dropdowns. Coverage is
// partial: only these call sites currently write audit entries.
export const AUDIT_ENTITY_TYPES = [
  "USER",
  "WALLET",
  "WALLET_MEMBER",
  "WALLET_INVITATION",
  "WALLET_SHARED_INVITATION",
  "TRANSACTION",
  "TRANSFER",
  "BUDGET",
  "REVIEW",
  "AI_PROMPT_TEMPLATE",
  "CONTACT_MESSAGE",
] as const;

export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number];

// CONTACT_MESSAGE breaks the <ENTITY>_<VERB> pattern: its only action is "CREATE".
export const AUDIT_ACTIONS_BY_ENTITY: Record<AuditEntityType, string[]> = {
  USER: [
    "AUTH_REGISTER",
    "AUTH_LOGIN",
    "AUTH_LOGOUT",
    "USER_SUSPEND",
    "USER_REACTIVATE",
    "USER_ACCOUNT_DELETE",
  ],
  WALLET: [
    "WALLET_CREATE",
    "WALLET_UPDATE",
    "WALLET_DELETE",
    "WALLET_OWNERSHIP_TRANSFER",
  ],
  WALLET_MEMBER: [
    "WALLET_MEMBER_ROLE_CHANGE",
    "WALLET_MEMBER_STATUS_CHANGE",
    "WALLET_MEMBER_REMOVE",
  ],
  WALLET_INVITATION: [
    "WALLET_INVITATION_CREATE",
    "WALLET_INVITATION_RESEND",
    "WALLET_INVITATION_ACCEPT",
    "WALLET_INVITATION_DECLINE",
    "WALLET_INVITATION_CANCEL",
    "WALLET_INVITATION_FAILED_RECIPIENT_AUTHORIZATION",
  ],
  WALLET_SHARED_INVITATION: [
    "WALLET_SHARED_INVITATION_CREATE",
    "WALLET_SHARED_INVITATION_ACCEPT",
    "WALLET_SHARED_INVITATION_DECLINE",
    "WALLET_SHARED_INVITATION_CANCEL",
    "WALLET_SHARED_INVITATION_RESEND",
    "WALLET_SHARED_INVITATION_FAILED_RECIPIENT_AUTHORIZATION",
  ],
  TRANSACTION: [
    "TRANSACTION_CREATE",
    "TRANSACTION_UPDATE",
    "TRANSACTION_STATUS_CHANGE",
    "TRANSACTION_RESTORE",
    "TRANSACTION_DELETE",
    "TRANSACTION_WALLET_MOVE",
  ],
  TRANSFER: [
    "TRANSFER_CREATE",
    "TRANSFER_STATUS_CHANGE",
    "TRANSFER_RESTORE",
    "TRANSFER_DELETE",
    "TRANSFER_UPDATE",
  ],
  BUDGET: ["BUDGET_CREATE", "BUDGET_UPDATE"],
  REVIEW: ["REVIEW_STATUS_CHANGE"],
  AI_PROMPT_TEMPLATE: [
    "AI_PROMPT_TEMPLATE_CREATE",
    "AI_PROMPT_TEMPLATE_UPDATE",
    "AI_PROMPT_TEMPLATE_ACTIVATE",
    "AI_PROMPT_TEMPLATE_ARCHIVE",
    "AI_PROMPT_TEMPLATE_SET_DEFAULT",
    "AI_PROMPT_TEMPLATE_CREATE_VERSION",
  ],
  CONTACT_MESSAGE: ["CREATE"],
};

export const AUDIT_ACTIONS = Array.from(
  new Set(Object.values(AUDIT_ACTIONS_BY_ENTITY).flat()),
).sort();
