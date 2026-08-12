export interface CurrencySynchronizationResponse {
  synchronizationId: string;
  provider: string;
  status: "STARTED" | "SUCCESS" | "FAILED" | string;
  currenciesReceived?: number;
  currenciesUpdated?: number;
  ratesReceived?: number;
  ratesUpdated?: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface ApiResponseCurrencySynchronizationResponse {
  success: boolean;
  message?: string;
  data: CurrencySynchronizationResponse;
  timestamp?: string;
}

export interface CurrencyResponse {
  active: boolean;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces?: number;
  provider?: string;
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  rate?: number;
  change?: number;
  flag?: string;
}

export interface ApiResponseCurrencyResponse {
  success: boolean;
  message?: string;
  data: CurrencyResponse;
  timestamp?: string;
}

export interface CurrencyProviderStatusResponse {
  provider: string;
  status: "HEALTHY" | "STALE" | "UNAVAILABLE" | "SYNCHRONIZING" | "NEVER_SYNCED" | string;
  currenciesReceived?: number;
  ratesUpdated?: number;
  lastAttemptAt?: string;
  lastSuccessfulSyncAt?: string;
  stale: boolean;
  lastError?: string;
  message: string;
}

export interface ApiResponseCurrencyProviderStatusResponse {
  success: boolean;
  message?: string;
  data: CurrencyProviderStatusResponse;
  timestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export type CurrencyItem = CurrencyResponse;
export type ExchangeRate = CurrencyResponse;
export type ProviderStatus = CurrencyProviderStatusResponse;
export type SyncResponse = CurrencySynchronizationResponse;

export interface TransactionRecord {
  id: string;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  originalAmount: number;
  originalCurrency: string;
  date: string;
}