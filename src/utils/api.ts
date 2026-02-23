/// <reference types="vite/client" />
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    // Attach Bearer token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData: explicitly delete Content-Type so axios sets it fresh
    // with the correct multipart/form-data boundary string. Any pre-existing
    // Content-Type header (even "application/json" from a previous request)
    // would otherwise override axios's auto-detection and strip the boundary,
    // which causes multer to fail to parse the body on the server.
    if (config.data instanceof FormData) {
      console.log(
        "[API] FormData detected — deleting Content-Type header to let axios set boundary",
      );
      delete config.headers["Content-Type"];
    }

    console.log("[API] Request:", config.method?.toUpperCase(), config.url, {
      isFormData: config.data instanceof FormData,
      contentType: config.headers["Content-Type"] ?? "(auto)",
    });

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    console.log("[API] Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("[API] Error response:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
