import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import type {
  AuditLog,
  AuditLogPage,
  AuditLogQueryParams,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function unwrapAuditLogPage(raw: unknown): AuditLogPage {
  if (!raw) {
    return {
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
    };
  }

  const root =
    isRecord(raw) && "data" in raw && isRecord(raw.data) ? raw.data : raw;
  const body = isRecord(root) ? root : {};

  let content: AuditLog[] = [];
  if (Array.isArray(body.content)) {
    content = body.content as AuditLog[];
  } else if (Array.isArray(root)) {
    content = root as AuditLog[];
  }

  const pageMeta = isRecord(body.page) ? body.page : body;

  const pageNumber =
    typeof pageMeta.page === "number"
      ? pageMeta.page
      : typeof pageMeta.number === "number"
      ? pageMeta.number
      : typeof pageMeta.pageNumber === "number"
      ? pageMeta.pageNumber
      : 0;

  const size =
    typeof pageMeta.size === "number"
      ? pageMeta.size
      : typeof pageMeta.pageSize === "number"
      ? pageMeta.pageSize
      : 20;

  const totalElements =
    typeof pageMeta.totalElements === "number"
      ? pageMeta.totalElements
      : content.length;

  const totalPages =
    typeof pageMeta.totalPages === "number"
      ? pageMeta.totalPages
      : totalElements > 0
      ? Math.ceil(totalElements / (size || 1))
      : 0;

  const first =
    typeof body.first === "boolean" ? body.first : pageNumber === 0;

  const last =
    typeof body.last === "boolean"
      ? body.last
      : pageNumber >= totalPages - 1;

  return {
    content,
    page: pageNumber,
    size,
    totalElements,
    totalPages,
    first,
    last,
  };
}

export function unwrapAuditLog(raw: unknown): AuditLog {
  if (isRecord(raw) && "data" in raw && isRecord(raw.data)) {
    return raw.data as unknown as AuditLog;
  }
  return raw as AuditLog;
}

export function buildAuditLogQueryParams(params?: AuditLogQueryParams): string {
  if (!params) return "";
  const query = new URLSearchParams();

  const page = params.page ?? params.pageNumber ?? 0;
  const size = params.size ?? params.pageSize ?? 20;

  query.set("page", String(page));
  query.set("pageNumber", String(page));
  query.set("size", String(size));
  query.set("pageSize", String(size));

  const searchTerm = params.search || params.query;
  if (searchTerm && searchTerm.trim()) {
    query.set("query", searchTerm.trim());
    query.set("search", searchTerm.trim());
  }

  if (params.action && params.action !== "ALL") {
    query.set("action", params.action);
  }

  if (params.entityType && params.entityType !== "ALL") {
    query.set("entityType", params.entityType);
  }

  if (params.userId) {
    query.set("userId", params.userId);
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortDirection) {
    query.set("sortDirection", params.sortDirection);
  }

  return query.toString();
}

export const auditLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/audit-logs
    getAuditLogs: builder.query<AuditLogPage, AuditLogQueryParams | void>({
      query: (params) => {
        const queryString = buildAuditLogQueryParams(params || undefined);
        return queryString
          ? `${ENDPOINTS.ADMIN_AUDIT_LOGS}?${queryString}`
          : ENDPOINTS.ADMIN_AUDIT_LOGS;
      },
      transformResponse: unwrapAuditLogPage,
      providesTags: (result) => [
        { type: API_TAGS.AUDIT_LOG, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({
          type: API_TAGS.AUDIT_LOG,
          id,
        })),
      ],
    }),

    // GET /api/v1/admin/audit-logs/{auditLogId}
    getAuditLogById: builder.query<AuditLog, string>({
      query: (auditLogId) => ENDPOINTS.ADMIN_AUDIT_LOGS_BY_ID(auditLogId),
      transformResponse: unwrapAuditLog,
      providesTags: (_result, _error, id) => [{ type: API_TAGS.AUDIT_LOG, id }],
    }),

    // GET /api/v1/admin/audit-logs/users/{userId}
    getAuditLogsByUser: builder.query<
      AuditLogPage,
      { userId: string } & AuditLogQueryParams
    >({
      query: ({ userId, ...params }) => {
        const queryString = buildAuditLogQueryParams(params);
        return queryString
          ? `${ENDPOINTS.ADMIN_AUDIT_LOGS_BY_USER(userId)}?${queryString}`
          : ENDPOINTS.ADMIN_AUDIT_LOGS_BY_USER(userId);
      },
      transformResponse: unwrapAuditLogPage,
      providesTags: (result, _error, { userId }) => [
        { type: API_TAGS.AUDIT_LOG, id: `USER_${userId}` },
        ...(result?.content ?? []).map(({ id }) => ({
          type: API_TAGS.AUDIT_LOG,
          id,
        })),
      ],
    }),

    // GET /api/v1/admin/audit-logs/entities/{entityType}/{entityId}
    getAuditLogsByEntity: builder.query<
      AuditLogPage,
      { entityType: string; entityId: string } & AuditLogQueryParams
    >({
      query: ({ entityType, entityId, ...params }) => {
        const queryString = buildAuditLogQueryParams(params);
        return queryString
          ? `${ENDPOINTS.ADMIN_AUDIT_LOGS_BY_ENTITY(entityType, entityId)}?${queryString}`
          : ENDPOINTS.ADMIN_AUDIT_LOGS_BY_ENTITY(entityType, entityId);
      },
      transformResponse: unwrapAuditLogPage,
      providesTags: (result, _error, { entityType, entityId }) => [
        { type: API_TAGS.AUDIT_LOG, id: `ENTITY_${entityType}_${entityId}` },
        ...(result?.content ?? []).map(({ id }) => ({
          type: API_TAGS.AUDIT_LOG,
          id,
        })),
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAuditLogsQuery,
  useLazyGetAuditLogsQuery,
  useGetAuditLogByIdQuery,
  useLazyGetAuditLogByIdQuery,
  useGetAuditLogsByUserQuery,
  useLazyGetAuditLogsByUserQuery,
  useGetAuditLogsByEntityQuery,
  useLazyGetAuditLogsByEntityQuery,
} = auditLogsApi;
