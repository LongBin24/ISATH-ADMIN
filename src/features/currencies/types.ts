
export interface ProviderStatus {
  provider: string;
  status: string; 
  lastSuccessfulSyncAt: string;
  stale: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  active: boolean;
  rate?: number;   
  change?: number; 
  flag?: string; 
  decimalPlaces?: number; 
}

export interface SyncResponse {
  synchronizationId: string;
  status: string;
  startedAt: string;
}
export type ExchangeRate = CurrencyItem; 
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}