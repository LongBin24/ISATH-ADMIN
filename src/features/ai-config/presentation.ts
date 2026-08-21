import type { TaskType, TemplateScope } from "./types";

export interface TaskTypeUiConfig {
  label: string;
  badgeClassName: string;
  dotClassName: string;
}

export interface TemplateScopeUiConfig {
  label: string;
  badgeClassName: string;
}

export const TASK_TYPE_STYLES: Record<string, TaskTypeUiConfig> = {
  CATEGORY_PREDICTION: {
    label: "Category Prediction",
    badgeClassName:
      "border-indigo-200/90 bg-indigo-50/90 text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300",
    dotClassName: "bg-indigo-500",
  },
  FINANCIAL_ASSISTANT: {
    label: "Financial Assistant",
    badgeClassName:
      "border-sky-200/90 bg-sky-50/90 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/50 dark:text-sky-300",
    dotClassName: "bg-sky-500",
  },
};

export const TEMPLATE_SCOPE_STYLES: Record<string, TemplateScopeUiConfig> = {
  SPENDING_ANALYSIS: {
    label: "Spending Analysis",
    badgeClassName:
      "border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
  },
  SAVINGS_ANALYSIS: {
    label: "Savings Analysis",
    badgeClassName:
      "border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  INCOME_ANALYSIS: {
    label: "Income Analysis",
    badgeClassName:
      "border-teal-200/80 bg-teal-50/80 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-300",
  },
  MONTHLY_SUMMARY: {
    label: "Monthly Summary",
    badgeClassName:
      "border-purple-200/80 bg-purple-50/80 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300",
  },
  GENERAL_CONVERSATION: {
    label: "General Conversation",
    badgeClassName:
      "border-blue-200/80 bg-blue-50/80 text-[#003377] dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-sky-300",
  },
  GENERAL_QUESTION: {
    label: "General Question",
    badgeClassName:
      "border-slate-200/80 bg-slate-100/80 text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-300",
  },
};

const DEFAULT_TASK_TYPE_STYLE: TaskTypeUiConfig = {
  label: "Task",
  badgeClassName:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  dotClassName: "bg-slate-400",
};

const DEFAULT_TEMPLATE_SCOPE_STYLE: TemplateScopeUiConfig = {
  label: "Scope",
  badgeClassName:
    "border-slate-200/80 bg-slate-100/80 text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400",
};

export function getTaskTypeStyle(taskType?: TaskType | string | null): string {
  if (!taskType) return DEFAULT_TASK_TYPE_STYLE.badgeClassName;
  return TASK_TYPE_STYLES[taskType]?.badgeClassName ?? DEFAULT_TASK_TYPE_STYLE.badgeClassName;
}

export function getTaskTypeDot(taskType?: TaskType | string | null): string {
  if (!taskType) return DEFAULT_TASK_TYPE_STYLE.dotClassName;
  return TASK_TYPE_STYLES[taskType]?.dotClassName ?? DEFAULT_TASK_TYPE_STYLE.dotClassName;
}

export function getTemplateScopeStyle(scope?: TemplateScope | string | null): string {
  if (!scope) return DEFAULT_TEMPLATE_SCOPE_STYLE.badgeClassName;
  return TEMPLATE_SCOPE_STYLES[scope]?.badgeClassName ?? DEFAULT_TEMPLATE_SCOPE_STYLE.badgeClassName;
}
