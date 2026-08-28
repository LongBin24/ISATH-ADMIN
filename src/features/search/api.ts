import { baseApi } from "@/api/baseApi";
import { ENDPOINTS } from "@/api/endpoints";
import { API_TAGS } from "@/api/tags";
import {
  AdminSearchGroupsResponse,
  AdminSearchResponse,
  ApiResponseSearch,
  SearchQueryParams,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function unwrapSearchResponse(raw: unknown): AdminSearchResponse {
  const root = isRecord(raw) && isRecord(raw.data) ? raw.data : raw;
  const body = isRecord(root) ? root : {};

  const rawGroups = isRecord(body.groups) ? body.groups : {};

  const alertRules = Array.isArray(rawGroups.alertRules) ? rawGroups.alertRules : [];
  const categories = Array.isArray(rawGroups.categories) ? rawGroups.categories : [];
  const currencies = Array.isArray(rawGroups.currencies) ? rawGroups.currencies : [];
  const notifications = Array.isArray(rawGroups.notifications) ? rawGroups.notifications : [];
  const reviews = Array.isArray(rawGroups.reviews) ? rawGroups.reviews : [];
  const users = Array.isArray(rawGroups.users) ? rawGroups.users : [];

  const groups: AdminSearchGroupsResponse = {
    alertRules,
    categories,
    currencies,
    notifications,
    reviews,
    users,
  };

  const calculatedTotal =
    alertRules.length +
    categories.length +
    currencies.length +
    notifications.length +
    reviews.length +
    users.length;

  const totalResults =
    typeof body.totalResults === "number" ? body.totalResults : calculatedTotal;

  const query = typeof body.query === "string" ? body.query : "";

  return {
    query,
    totalResults,
    groups,
  };
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalSearch: builder.query<AdminSearchResponse, SearchQueryParams | string | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (typeof params === "string") {
          if (params.trim()) {
            queryParams.set("q", params.trim());
          }
        } else if (params && typeof params === "object") {
          const queryStr = params.q ?? params.query;
          if (queryStr && typeof queryStr === "string" && queryStr.trim()) {
            queryParams.set("q", queryStr.trim());
          }

          if (typeof params.limit === "number") {
            queryParams.set("limit", String(params.limit));
          }

          // Append any extra dynamic key: value query parameters if provided
          Object.entries(params).forEach(([key, val]) => {
            if (
              key !== "query" &&
              key !== "q" &&
              key !== "limit" &&
              val !== undefined &&
              val !== null &&
              val !== ""
            ) {
              queryParams.set(key, String(val));
            }
          });
        }

        const queryString = queryParams.toString();
        return {
          url: queryString ? `${ENDPOINTS.ADMIN_SEARCH}?${queryString}` : ENDPOINTS.ADMIN_SEARCH,
          method: "GET",
        };
      },
      transformResponse: (response: ApiResponseSearch | AdminSearchResponse | unknown) =>
        unwrapSearchResponse(response),
      providesTags: [API_TAGS.SEARCH],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetGlobalSearchQuery,
  useLazyGetGlobalSearchQuery,
} = searchApi;
