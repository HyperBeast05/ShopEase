import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle expired or invalid authentication
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config;

    const hasAuthorization =
      !!config?.headers?.Authorization || !!config?.headers?.authorization;

    const publicAuthEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicAuthRequest = publicAuthEndpoints.some((endpoint) =>
      config?.url?.includes(endpoint),
    );

    if (status === 401 && hasAuthorization && !isPublicAuthRequest) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);

export default api;
