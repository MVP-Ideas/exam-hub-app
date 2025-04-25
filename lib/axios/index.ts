/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { isProblemDetails } from "../utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry if endpoint is /auth/acquire
    if (originalRequest?.url?.includes("/auth/acquire")) {
      return Promise.reject(error);
    }

    // Attempt re-authentication on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/acquire");
        return api(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    const responseData = error.response?.data;
    if (responseData && isProblemDetails(responseData)) {
      (error as AxiosError & { details?: any }).details = responseData;
    }

    return Promise.reject(error);
  },
);

export default api;
