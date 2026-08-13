import { baseApi } from "@/api/baseApi";
import { API_TAGS } from "@/api/tags";
import { AlertRule, AlertRulePage, AlertRuleQueryParams } from "./types";

const ALERT_RULES_ENDPOINT = "admin/alert-rules";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapAlertRule(response: unknown): AlertRule {
  if (isRecord(response) && isRecord(response.data)) {
    return response.data as unknown as AlertRule;
  }

  return response as AlertRule;
}

function unwrapAlertRules(response: unknown): AlertRule[] {
  if (Array.isArray(response)) return response as AlertRule[];

  if (isRecord(response) && Array.isArray(response.content)) {
    return response.content as AlertRule[];
  }

  if (isRecord(response) && Array.isArray(response.data)) {
    return response.data as AlertRule[];
  }

  return [];
}

function unwrapAlertRulePage(response: unknown): AlertRulePage {
  const root = isRecord(response) && isRecord(response.data) ? response.data : response;
  const body = isRecord(root) ? root : {};
  const content = Array.isArray(body.content) ? body.content as AlertRule[] : [];
  const page = isRecord(body.page) ? body.page : body;
  const number = typeof page.number === "number" ? page.number : 0;
  const size = typeof page.size === "number" ? page.size : content.length;
  const totalElements = typeof page.totalElements === "number" ? page.totalElements : content.length;
  const totalPages = typeof page.totalPages === "number" ? page.totalPages : totalElements ? 1 : 0;
  return { content, page: { number, size, totalElements, totalPages } };
}

export const alertRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlertRules: builder.query<
      AlertRule[],
      { search?: string; severity?: string; status?: string } | void
    >({
      query: () => ({
        url: ALERT_RULES_ENDPOINT,
        params: { pageNumber: 0, pageSize: 200 },
      }),
      transformResponse: unwrapAlertRules,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: API_TAGS.ALERT_RULE,
                id,
              })),
              {
                type: API_TAGS.ALERT_RULE,
                id: "LIST",
              },
            ]
          : [
              {
                type: API_TAGS.ALERT_RULE,
                id: "LIST",
              },
            ],
    }),
    getAdminAlertRules: builder.query<AlertRulePage, AlertRuleQueryParams>({
      query: (params) => ({ url: ALERT_RULES_ENDPOINT, params }),
      transformResponse: unwrapAlertRulePage,
      providesTags: (result) => [
        { type: API_TAGS.ALERT_RULE, id: "LIST" },
        ...(result?.content ?? []).map(({ id }) => ({ type: API_TAGS.ALERT_RULE, id })),
      ],
    }),
    getAlertRuleById: builder.query<AlertRule, string>({
      query: (ruleId) =>
        `${ALERT_RULES_ENDPOINT}/${encodeURIComponent(ruleId)}`,
      transformResponse: unwrapAlertRule,
      providesTags: (_result, _error, id) => [
        {
          type: API_TAGS.ALERT_RULE,
          id,
        },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAlertRulesQuery,
  useGetAdminAlertRulesQuery,
  useGetAlertRuleByIdQuery,
  useLazyGetAlertRuleByIdQuery,
} = alertRulesApi;
