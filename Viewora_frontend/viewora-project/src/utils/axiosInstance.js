
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true,
});

// REQUEST INTERCEPTOR: Attach Authorization header if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/login") &&
      !originalRequest.url.includes("/api/auth/refresh") &&
      !originalRequest.url.includes("/api/auth/google-login")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axiosInstance.post("/api/auth/refresh/", {
          refresh: refreshToken,
        });

        // Save the new access token if it was returned in the body
        if (response.data && response.data.access) {
          localStorage.setItem("access_token", response.data.access);
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear tokens on persistent 401
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // ONLY REDIRECT IF NOT ALREADY ON LOGIN (prevents infinite reload)
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/signup")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
