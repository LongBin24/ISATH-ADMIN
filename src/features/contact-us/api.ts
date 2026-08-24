import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import type {
  ApiResponse,
  ContactMessage,
  ContactMessageDetail,
  ContactMessagePage,
  ContactQueryParams,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function unwrapContactPage(raw: unknown): ContactMessagePage {
  if (!raw) {
    return { content: [], page: 0, size: 20, totalElements: 0, totalPages: 0, first: true, last: true };
  }

  const root = isRecord(raw) && "data" in raw && isRecord(raw.data) ? raw.data : raw;
  const body = isRecord(root) ? root : {};

  let content: ContactMessage[] = [];
  if (Array.isArray(body.content)) {
    content = body.content as ContactMessage[];
  } else if (Array.isArray(root)) {
    content = root as ContactMessage[];
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
    typeof body.first === "boolean"
      ? body.first
      : pageNumber === 0;

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

export function unwrapContactMessage(raw: unknown): ContactMessage {
  if (isRecord(raw) && "data" in raw && isRecord(raw.data)) {
    return raw.data as unknown as ContactMessage;
  }
  return raw as ContactMessage;
}

export function buildContactQueryParams(params?: ContactQueryParams): string {
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

  if (params.registeredUser !== undefined) {
    query.set("registeredUser", String(params.registeredUser));
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  if (params.sortDirection) {
    query.set("sortDirection", params.sortDirection);
  }

  return query.toString();
}

export const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/admin/contact-us
    getContactMessages: builder.query<ContactMessagePage, ContactQueryParams | void>({
      query: (params) => {
        const queryString = buildContactQueryParams(params || undefined);
        return queryString
          ? `${ENDPOINTS.ADMIN_CONTACT_US}?${queryString}`
          : ENDPOINTS.ADMIN_CONTACT_US;
      },
      transformResponse: unwrapContactPage,
      providesTags: (result) => [
        { type: API_TAGS.CONTACT_US, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({ type: API_TAGS.CONTACT_US, id })),
      ],
    }),

    // GET /api/v1/admin/contact-us/{contactId}
    getContactById: builder.query<ContactMessage, string>({
      query: (contactId) => ENDPOINTS.ADMIN_CONTACT_US_BY_ID(contactId),
      transformResponse: unwrapContactMessage,
      providesTags: (_result, _error, id) => [{ type: API_TAGS.CONTACT_US, id }],
    }),

    // Alias for getContactById
    getContactMessageById: builder.query<ContactMessage, string>({
      query: (contactId) => ENDPOINTS.ADMIN_CONTACT_US_BY_ID(contactId),
      transformResponse: unwrapContactMessage,
      providesTags: (_result, _error, id) => [{ type: API_TAGS.CONTACT_US, id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetContactMessagesQuery,
  useLazyGetContactMessagesQuery,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
  useGetContactMessageByIdQuery,
  useLazyGetContactMessageByIdQuery,
} = contactUsApi;
