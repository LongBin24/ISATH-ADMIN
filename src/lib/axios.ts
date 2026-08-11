import axios from "axios";
import { toast } from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const token =
      process.env.NEXT_PUBLIC_ACCESS_TOKEN ??
      getCookie("better-auth.session_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
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
      const message =
        error.response?.data?.message || "មានបញ្ហាអ្វីមួយបានកើតឡើង!";
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
