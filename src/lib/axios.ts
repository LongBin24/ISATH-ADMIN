import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window === "undefined"
        ? null
        : window.localStorage.getItem("accessToken") ||
          window.localStorage.getItem("token") ||
          window.sessionStorage.getItem("accessToken") ||
          window.sessionStorage.getItem("token") ||
          document.cookie.match(/(?:^|; )accessToken=([^;]+)/)?.[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      toast.error("Session របស់អ្នកអស់សុពលភាព សូម Login ម្តងទៀត");
    } else if (status === 403) {
      toast.error("អ្នកគ្មានសិទ្ធិចូលប្រើមុខងារនេះទេ");
    } else if (status === 500) {
      toast.error("មានបញ្ហាបច្ចេកទេសនៅខាង Server");
    } else {
      const message = error.response?.data?.message || "មានបញ្ហាអ្វីមួយបានកើតឡើង!";
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;