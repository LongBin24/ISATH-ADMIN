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

    // const token = getCookie("better-auth.session_token");
    const token =
      "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfRFo0Y3dBMG50cmtUODE5SlRxaUhFcEo1NFRVcmpmaFFrVWItZk8tWHZRIn0.eyJleHAiOjE3ODYzMjc1MTIsImlhdCI6MTc4NjI5MTUxOCwiYXV0aF90aW1lIjoxNzg2MjkxNTEyLCJqdGkiOiJvbnJ0YWM6MTE3YzdhN2ItZmIyNS0wZjcxLWQyZTctZjgxNGNmNGQ4YzE5IiwiaXNzIjoiaHR0cHM6Ly9pdGUta2V5Y2xvYWsuaXN0YXNoa2guY29tL3JlYWxtcy9pc3Rhc2giLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiYWM3NDdmZmEtYjY0Ny00NjU0LWFkNWQtYTBjMjM1MDlhYjQzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaXN0YXNoLWNsaWVudCIsInNpZCI6IjFMVjlGQ2lVY3pqTDhjRnNWem03ckFzRyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9pLXN0YXNoLWZyb250LWVuZC52ZXJjZWwuYXBwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWlzdGFzaCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJVU0VSIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoibHlseSBOYWthIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibHlseS5uYWthLjkzYWMxOThjIiwiZ2l2ZW5fbmFtZSI6Imx5bHkiLCJmYW1pbHlfbmFtZSI6Ik5ha2EiLCJlbWFpbCI6InRob3VlbnZhbmx5QGdtYWlsLmNvbSJ9.Vwln4do3G5LyQftOZmbMd5OU4A1dZs2v_P2mj6VWVpVYa11SGnk986bv6HWtInfRfMsVVDTwfFbvAcgtKamqb9GVXO2SNNYCxf9O1WGtT5P3GxSm3pnPn_COWpsLldmL_NNyCOSSZTR9z4NMoLhiwI2D_onTM1eJS603vawJmEgcv9eDiUB8OVBtU6VIQOr-S_WWpbXQG5s-l99q2sxoSd8-1gLhjZF7QP2TLP-BL4GNQSxGGzthbvcJnL0kYEZwE0Ci3fIRN57ZUNtbjWgq6D1H_Sa2qzhHhmcLxLHLZKTDPrzfU8WUQOIeIqPxjp4qHJT-0xPOC4-pkKF0SoPiHw";

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
