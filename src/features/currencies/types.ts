<<<<<<< HEAD
export interface ProviderStatus {
  provider: string;
  status: string;
  lastAttemptAt?: string;
  lastSuccessfulSyncAt: string;
  currenciesReceived?: number;
  ratesUpdated?: number;
  stale: boolean;
  lastError?: string | null;
  message: string;
=======
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
>>>>>>> feature/admin-api-integration
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
<<<<<<< HEAD
=======
  lastSyncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
>>>>>>> feature/admin-api-integration
  rate?: number;
  change?: number;
  flag?: string;
}

<<<<<<< HEAD
export type ExchangeRate = CurrencyItem;

export interface SyncResponse {
  synchronizationId: string;
  provider: string;
  status: string;
  currenciesReceived: number;
  currenciesUpdated: number;
  ratesReceived: number;
  ratesUpdated: number;
  startedAt: string;
  completedAt: string;
  errorMessage?: string | null;
}

=======
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

// Common generic ApiResponse
>>>>>>> feature/admin-api-integration
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

<<<<<<< HEAD
=======
// Aliases for backward compatibility
export type CurrencyItem = CurrencyResponse;
export type ExchangeRate = CurrencyResponse;
export type ProviderStatus = CurrencyProviderStatusResponse;
export type SyncResponse = CurrencySynchronizationResponse;

>>>>>>> feature/admin-api-integration
export interface TransactionRecord {
  id: string;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  originalAmount: number;
  originalCurrency: string;
  date: string;
}