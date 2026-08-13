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
  user?: any;
  data?: {
    token?: string;
    accessToken?: string;
    access_token?: string;
    refreshToken?: string;
    user?: any;
  };
}

export interface LogoutPayload {
  refreshToken: string;
}
