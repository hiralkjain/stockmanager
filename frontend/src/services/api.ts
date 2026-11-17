import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error & 401 Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and stored credentials on 401 Unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        storage.clearAuth();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Extracts a user-friendly error message from Axios errors or backend responses.
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    // Backend Spring Boot GlobalExceptionHandler format: { error: "message" }
    if (responseData && typeof responseData === 'object') {
      if ('error' in responseData && typeof responseData.error === 'string') {
        return responseData.error;
      }
      if ('message' in responseData && typeof responseData.message === 'string') {
        return responseData.message;
      }
      // Validation errors format: { fieldName: "validation message" }
      const validationKeys = Object.keys(responseData);
      if (validationKeys.length > 0) {
        const firstKey = validationKeys[0];
        const msg = (responseData as Record<string, string>)[firstKey];
        return `${firstKey}: ${msg}`;
      }
    }

    if (error.response?.status === 401) {
      return 'Session expired or invalid credentials. Please log in again.';
    }

    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === 404) {
      return 'The requested resource was not found on the server.';
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Cannot connect to backend server at ' + API_BASE_URL + '. Is Spring Boot running on port 8081?';
    }

    return error.message || 'An unexpected network error occurred.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export default apiClient;
