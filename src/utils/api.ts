/// <reference types="vite/client" />
import axios, { AxiosInstance } from "axios";

// Store is injected after creation in index.tsx to avoid circular imports:
// api → store → authSlice → auth actions → api
type StoreType = { dispatch: (action: unknown) => void };
let _store: StoreType | null = null;
export const injectStore = (store: StoreType) => { _store = store; };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // sends httpOnly auth cookie on every request
});

api.interceptors.request.use(
  (config) => {
    // For FormData: explicitly delete Content-Type so axios sets it fresh
    // with the correct multipart/form-data boundary string. Any pre-existing
    // Content-Type header (even "application/json" from a previous request)
    // would otherwise override axios's auto-detection and strip the boundary,
    // which causes multer to fail to parse the body on the server.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    if (import.meta.env.DEV) {
      console.log("[API] Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log("[API] Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("[API] Error:", {
        status: error.response?.status,
        url: error.config?.url,
      });
    }

    if (error.response?.status === 401) {
      // Dispatch resetAuth so ProtectedRoute redirects to /
      // Do NOT use window.location.href here — that causes an infinite
      // reload loop because getMe() fires on every mount and returns 401
      // when no session exists (normal on the login page)
      _store?.dispatch({ type: "auth/resetAuth" });
    }
    return Promise.reject(error);
  },
);

export default api;
