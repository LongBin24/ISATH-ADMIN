import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Standard API Client with automatic token header injection and error handling
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    let token: string | undefined | null;

    if (typeof window !== "undefined") {
      token =
        window.localStorage.getItem("accessToken") ||
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("accessToken") ||
        window.sessionStorage.getItem("token") ||
        document.cookie.match(/(?:^|; )accessToken=([^;]+)/)?.[1];
    }

    if (!token && process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN) {
      token = process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Handle unauthorized session
      console.warn("Unauthorized API call, redirecting or clearing token...");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
