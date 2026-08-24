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
