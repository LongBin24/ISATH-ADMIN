import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    // const token = getCookie("better-auth.session_token");
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJfRFo0Y3dBMG50cmtUODE5SlRxaUhFcEo1NFRVcmpmaFFrVWItZk8tWHZRIn0.eyJleHAiOjE3ODYyMTIwNjksImlhdCI6MTc4NjE3NjA3NSwiYXV0aF90aW1lIjoxNzg2MTc2MDY5LCJqdGkiOiJvbnJ0YWM6YTM2Y2VjOTQtNTIwNC0wNmFiLWY3OWMtYTE3NWFjM2JjYTI3IiwiaXNzIjoiaHR0cHM6Ly9pdGUta2V5Y2xvYWsuaXN0YXNoa2guY29tL3JlYWxtcy9pc3Rhc2giLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODMwZWE0NGEtOTM5My00MTY2LTg2OWQtNzgwMTY1ZjAwNDk4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaXN0YXNoLWNsaWVudCIsInNpZCI6IjZZa0N0VVRpaXk5cUhpOEhSQndDNlRsWiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9pLXN0YXNoLWZyb250LWVuZC52ZXJjZWwuYXBwIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWlzdGFzaCIsIm9mZmxpbmVfYWNjZXNzIiwiQURNSU4iLCJ1bWFfYXV0aG9yaXphdGlvbiIsIlVTRVIiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBbGx5IFZhbiIsInByZWZlcnJlZF91c2VybmFtZSI6InRob3VlbnZhbmx5QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJBbGx5IiwiZmFtaWx5X25hbWUiOiJWYW4iLCJlbWFpbCI6InRob3VlbnZhbmx5QGdtYWlsLmNvbSJ9.Ls39ZOrKkzyqW1mbyXU_jI4DxJrzk1U-VhYONRdy2Yic2y_TT-1t7DqqJ-Fs8KOlOzUh_pqVPVRYor47i3DN3oIwPJFr6TXy-7lQyedbU7ltKUI4HgTuJQlk_qU5m8dUv9IH4btHj12JdO7ntYz00KA1mggCJPZQLnRaYWVTdJVRGykzoyHW9BidpKdkKFUDPVzlgsen0FWNDhjT60B1RYZV98H3ERsmpRIeCaExqBlTRo1up_YLvZkz3XanMeNg-KveqdqoCI-rhq8tREBhmhoPtfqwjHnzXCAm2G1g7SmRWqd_vDy6IkKGF-MN_EC_D38yPtMQUc7KVsWMurGikw";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
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