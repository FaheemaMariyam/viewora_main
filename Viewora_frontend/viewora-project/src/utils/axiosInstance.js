
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
});


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
        await axiosInstance.post("/api/auth/refresh/");
        return axiosInstance(originalRequest);
      } catch {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
