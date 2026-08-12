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
}

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces?: number;
  active: boolean;
  provider?: string;
  rate?: number;
  change?: number;
  flag?: string;
}

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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface TransactionRecord {
  id: string;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  originalAmount: number;
  originalCurrency: string;
  date: string;
}