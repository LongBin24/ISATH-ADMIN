export interface LoginPayload {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  user?: Record<string, unknown>;
  data?: {
    token?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    user?: Record<string, unknown>;
  };
}

export interface LogoutPayload {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export type LogoutResponse = ApiResponse<null>;
