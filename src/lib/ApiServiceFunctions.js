import { toast } from "sonner";
import axios from "axios";
import ApiEndPoints from "./ApiServiceEndpoint";
import ErrorHandler from "./errorHandler";

const authModeDev = true; // Enable localStorage usage

let storedToken = "";
let refreshToken = "";

// Removed handleError function - now handling errors inline with consistent format

const ApiService = {
  setToken: (token) => {
    storedToken = token;
  },
  getAcessToken: () => {
    return authModeDev
      ? storedToken || localStorage.getItem("token")
      : storedToken;
  },
  setRefreshToken: (token) => {
    refreshToken = token;
  },
  getRefreshToken: () => {
    return authModeDev
      ? refreshToken || localStorage.getItem("refresh_token")
      : refreshToken;
  },
  get: async (url, { params = {}, headers = {} } = {}, retryCount = 0) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
        params, // Pass params directly to axios
      });
      return {
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error("API GET Error:", error);
      
      // Handle 401 errors with automatic token refresh retry
      if (error.response?.status === 401 && retryCount === 0) {
        const refreshResult = await ApiService.refreshAccessToken();
        if (!refreshResult.error) {
          // Retry the request with new token
          return ApiService.get(url, { params, headers }, 1);
        }
      }
      
      const errMsg = error.response?.data?.detail || error.message || "Request failed";
      
      // For specific errors that should be thrown (like 404), maintain existing behavior
      if (error?.response?.status === 404 || 
          errMsg.includes("An unexpected error occurred while searching the hierarchy")) {
        throw error;
      }
      
      // Show toast for user-facing errors (but not for 401 on retry)
      if (!(error.response?.status === 401 && retryCount > 0)) {
        toast.error(errMsg);
      }
      
      return {
        data: null,
        error: {
          message: errMsg,
          status: error.response?.status || 500,
          code: error.response?.data?.code || "REQUEST_ERROR"
        }
      };
    }
  },
  post: async (url, data, headers, retryCount = 0) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
      });
      return {
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error("API POST Error:", error);
      
      // Handle 401 errors with automatic token refresh retry
      if (error.response?.status === 401 && retryCount === 0) {
        const refreshResult = await ApiService.refreshAccessToken();
        if (!refreshResult.error) {
          // Retry the request with new token
          return ApiService.post(url, data, headers, 1);
        }
      }
      
      const errMsg = error.response?.data?.detail || error.message || "Request failed";
      
      // For specific errors that should be thrown (like 404), maintain existing behavior
      if (error?.response?.status === 404 || 
          errMsg.includes("An unexpected error occurred while searching the hierarchy")) {
        throw error;
      }
      
      // Show toast for user-facing errors (but not for 401 on retry)
      if (!(error.response?.status === 401 && retryCount > 0)) {
        toast.error(errMsg);
      }
      
      return {
        data: null,
        error: {
          message: errMsg,
          status: error.response?.status || 500,
          code: error.response?.data?.code || "REQUEST_ERROR"
        }
      };
    }
  },
  put: async (url, data, headers, retryCount = 0) => {
    try {
      const response = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          ...headers,
        },
      });
      return {
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error("API PUT Error:", error);
      
      // Handle 401 errors with automatic token refresh retry
      if (error.response?.status === 401 && retryCount === 0) {
        const refreshResult = await ApiService.refreshAccessToken();
        if (!refreshResult.error) {
          // Retry the request with new token
          return ApiService.put(url, data, headers, 1);
        }
      }
      
      const errMsg = error.response?.data?.detail || error.message || "Request failed";
      
      // For specific errors that should be thrown (like 404), maintain existing behavior
      if (error?.response?.status === 404 || 
          errMsg.includes("An unexpected error occurred while searching the hierarchy")) {
        throw error;
      }
      
      // Show toast for user-facing errors (but not for 401 on retry)
      if (!(error.response?.status === 401 && retryCount > 0)) {
        toast.error(errMsg);
      }
      
      return {
        data: null,
        error: {
          message: errMsg,
          status: error.response?.status || 500,
          code: error.response?.data?.code || "REQUEST_ERROR"
        }
      };
    }
  },
  delete: async (url, retryCount = 0) => {
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
        },
      });
      return {
        data: response.data,
        error: null
      };
    } catch (error) {
      console.error("API DELETE Error:", error);
      
      // Handle 401 errors with automatic token refresh retry
      if (error.response?.status === 401 && retryCount === 0) {
        const refreshResult = await ApiService.refreshAccessToken();
        if (!refreshResult.error) {
          // Retry the request with new token
          return ApiService.delete(url, 1);
        }
      }
      
      const errMsg = error.response?.data?.detail || error.message || "Request failed";
      
      // For specific errors that should be thrown (like 404), maintain existing behavior
      if (error?.response?.status === 404 || 
          errMsg.includes("An unexpected error occurred while searching the hierarchy")) {
        throw error;
      }
      
      // Show toast for user-facing errors (but not for 401 on retry)
      if (!(error.response?.status === 401 && retryCount > 0)) {
        toast.error(errMsg);
      }
      
      return {
        data: null,
        error: {
          message: errMsg,
          status: error.response?.status || 500,
          code: error.response?.data?.code || "REQUEST_ERROR"
        }
      };
    }
  },

  // Authentication API methods
  loginUser: async (credentials) => {
    try {
      const response = await axios.post(ApiEndPoints.AUTH.LOGIN, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Validate token format before storing
      const { access_token, refresh_token } = response.data;
      if (ApiService.isValidTokenFormat(access_token) && ApiService.isValidTokenFormat(refresh_token)) {
        ApiService.storeTokens(access_token, refresh_token);
      }
      
      return ErrorHandler.createSuccessResponse(response.data);
    } catch (error) {
      const errorResponse = ErrorHandler.handleAuthError(error);
      ErrorHandler.showError(errorResponse);
      return errorResponse;
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await axios.post(ApiEndPoints.AUTH.REGISTER, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return ErrorHandler.createSuccessResponse(response.data);
    } catch (error) {
      const errorResponse = ErrorHandler.handleAuthError(error);
      ErrorHandler.showError(errorResponse);
      return errorResponse;
    }
  },

  logoutUser: async () => {
    try {
      const response = await axios.post(ApiEndPoints.AUTH.LOGOUT, {}, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
          'Content-Type': 'application/json',
        },
      });
      return ErrorHandler.createSuccessResponse(response.data);
    } catch (error) {
      const errorResponse = ErrorHandler.handleAuthError(error);
      // Don't show error toast for logout failures
      ErrorHandler.showError(errorResponse, false);
      return errorResponse;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(ApiEndPoints.AUTH.USER_ME, {
        headers: {
          Authorization: `Bearer ${ApiService?.getAcessToken()}`,
        },
      });
      return ErrorHandler.createSuccessResponse(response.data);
    } catch (error) {
      const errorResponse = ErrorHandler.handleAuthError(error);
      // Don't show error toast for getCurrentUser failures (handled by useAuth)
      ErrorHandler.showError(errorResponse, false);
      return errorResponse;
    }
  },

  refreshAccessToken: async () => {
    try {
      const token = ApiService?.getRefreshToken();
      if (!token || !ApiService.isValidTokenFormat(token)) {
        return {
          data: null,
          error: {
            message: "No valid refresh token available",
            status: 401,
            code: "NO_REFRESH_TOKEN"
          }
        };
      }

      const response = await axios.post(
        `${ApiEndPoints.AUTH.REFRESH_TOKEN}?refresh_token=${token}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Validate and store new tokens
      const { access_token, refresh_token: newRefreshToken } = response.data;
      if (ApiService.isValidTokenFormat(access_token) && ApiService.isValidTokenFormat(newRefreshToken)) {
        ApiService.storeTokens(access_token, newRefreshToken);
      }
      
      return ErrorHandler.createSuccessResponse(response.data);
    } catch (error) {
      const errorResponse = ErrorHandler.handleAuthError(error);
      // Don't show error toast for refresh failures (handled by useAuth)
      ErrorHandler.showError(errorResponse, false);
      return errorResponse;
    }
  },

  // Token management utilities
  clearTokens: () => {
    storedToken = "";
    refreshToken = "";
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
    }
  },

  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token expires within the next 5 minutes (300 seconds)
      return payload.exp < (currentTime + 300);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Validate token format
  isValidTokenFormat: (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3;
  },

  // Get token expiration time
  getTokenExpiration: (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  },

  // Store tokens with expiration tracking
  storeTokens: (accessToken, refreshTokenValue) => {
    storedToken = accessToken;
    refreshToken = refreshTokenValue;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refreshTokenValue);
      
      // Store expiration time for quick checking
      const expiration = ApiService.getTokenExpiration(accessToken);
      if (expiration) {
        localStorage.setItem("token_expiry", expiration.toISOString());
      }
    }
  },

  // Check if stored tokens are valid
  hasValidTokens: () => {
    const token = ApiService.getAcessToken();
    const refresh = ApiService.getRefreshToken();
    
    return (
      ApiService.isValidTokenFormat(token) &&
      ApiService.isValidTokenFormat(refresh) &&
      !ApiService.isTokenExpired(token)
    );
  },
};

export default ApiService;
