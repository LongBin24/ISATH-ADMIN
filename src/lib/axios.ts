import axios from "axios";
import { createAuthClient } from "better-auth/react";
import { toast } from "react-hot-toast"; 

const authClient = createAuthClient();
const session = await authClient.getSession();
const token = session.data?.session?.token;
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const session = await authClient.getSession();
 
    const token = session?.data?.session?.token; 

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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
  },
);

export default axiosInstance;
