import { baseApi } from "@/api/baseApi";
import { ENDPOINTS_ALERT_RULES } from "@/api/endpoints";
import type { AlertRule } from "./types";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === "object" && value !== null;

const unwrapData = (response: unknown): unknown => {
  if (isRecord(response) && "data" in response) {
    return response.data;
  }

  return response;
};

const toAlertRule = (value: unknown): AlertRule => value as AlertRule;

const normalizeAlertRules = (response: unknown): AlertRule[] => {
  const payload = unwrapData(response);

  if (Array.isArray(payload)) {
    return payload.filter(isRecord).map(toAlertRule);
  }

  if (isRecord(payload)) {
    const rules = payload.content ?? payload.items ?? payload.alertRules;
    return Array.isArray(rules)
      ? rules.filter(isRecord).map(toAlertRule)
      : [];
  }

  return [];
};

const normalizeAlertRule = (response: unknown): AlertRule =>
  toAlertRule(unwrapData(response));

export const alertRulesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAlertRules: builder.query<AlertRule[], void>({
      query: () => ({
        url: ENDPOINTS_ALERT_RULES.GET_ALL,
        method: "GET",
      }),
      transformResponse: normalizeAlertRules,
    }),

    getAlertRuleById: builder.query<AlertRule, string>({
      query: (ruleId) => ({
        url: ENDPOINTS_ALERT_RULES.GET_BY_ID(ruleId),
        method: "GET",
      }),
      transformResponse: normalizeAlertRule,
    }),
  }),
});

export const { useGetAlertRulesQuery, useGetAlertRuleByIdQuery } =
  alertRulesApi;
