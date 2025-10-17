import { toast } from 'sonner';

/**
 * Centralized error handling utility
 */
export class ErrorHandler {
  /**
   * Create a standardized error response
   * @param {Error|Object} error - The error object
   * @param {string} defaultMessage - Default message if none found
   * @returns {Object} Standardized error response
   */
  static createErrorResponse(error, defaultMessage = 'An error occurred') {
    const errMsg = error.response?.data?.detail || error.message || defaultMessage;
    
    return {
      data: null,
      error: {
        message: errMsg,
        status: error.response?.status || 500,
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        details: error.response?.data?.details || null
      }
    };
  }

  /**
   * Create a standardized success response
   * @param {*} data - The response data
   * @returns {Object} Standardized success response
   */
  static createSuccessResponse(data) {
    return {
      data,
      error: null
    };
  }

  /**
   * Handle authentication errors specifically
   * @param {Error|Object} error - The error object
   * @returns {Object} Standardized error response
   */
  static handleAuthError(error) {
    const status = error.response?.status;
    let message = error.response?.data?.detail || error.message;
    let code = error.response?.data?.code;

    switch (status) {
      case 401:
        message = message || 'Invalid credentials or session expired';
        code = code || 'UNAUTHORIZED';
        break;
      case 403:
        message = message || 'Access denied. Insufficient permissions';
        code = code || 'FORBIDDEN';
        break;
      case 422:
        message = message || 'Invalid input data';
        code = code || 'VALIDATION_ERROR';
        break;
      case 429:
        message = message || 'Too many requests. Please try again later';
        code = code || 'RATE_LIMITED';
        break;
      default:
        message = message || 'Authentication failed';
        code = code || 'AUTH_ERROR';
    }

    return {
      data: null,
      error: {
        message,
        status: status || 500,
        code,
        details: error.response?.data?.details || null
      }
    };
  }

  /**
   * Handle network errors
   * @param {Error} error - The network error
   * @returns {Object} Standardized error response
   */
  static handleNetworkError(error) {
    let message = 'Network error occurred';
    let code = 'NETWORK_ERROR';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timeout. Please try again';
      code = 'TIMEOUT_ERROR';
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Unable to connect to server. Please check your internet connection';
      code = 'CONNECTION_ERROR';
    } else if (!navigator.onLine) {
      message = 'You appear to be offline. Please check your internet connection';
      code = 'OFFLINE_ERROR';
    }

    return {
      data: null,
      error: {
        message,
        status: 0,
        code,
        details: error.message
      }
    };
  }

  /**
   * Show user-friendly error messages
   * @param {Object} errorResponse - Standardized error response
   * @param {boolean} showToast - Whether to show toast notification
   */
  static showError(errorResponse, showToast = true) {
    if (!errorResponse.error) return;

    const { message, status, code } = errorResponse.error;

    if (showToast) {
      // Don't show toast for certain error types
      const silentErrors = ['UNAUTHORIZED', 'SESSION_EXPIRED', 'TOKEN_REFRESH_FAILED'];
      
      if (!silentErrors.includes(code)) {
        if (status >= 500) {
          toast.error(`Server Error: ${message}`);
        } else if (status === 429) {
          toast.warning(message);
        } else {
          toast.error(message);
        }
      }
    }

    // Log error for debugging
    console.error('Error occurred:', {
      message,
      status,
      code,
      details: errorResponse.error.details
    });
  }

  /**
   * Check if error should trigger logout
   * @param {Object} errorResponse - Standardized error response
   * @returns {boolean} Whether to logout user
   */
  static shouldLogout(errorResponse) {
    if (!errorResponse.error) return false;

    const { status, code } = errorResponse.error;
    const logoutCodes = [
      'UNAUTHORIZED',
      'SESSION_EXPIRED', 
      'TOKEN_REFRESH_FAILED',
      'INVALID_TOKEN'
    ];

    return status === 401 || logoutCodes.includes(code);
  }

  /**
   * Get user-friendly error message for display
   * @param {Object} errorResponse - Standardized error response
   * @returns {string} User-friendly message
   */
  static getUserMessage(errorResponse) {
    if (!errorResponse.error) return '';

    const { message, status, code } = errorResponse.error;

    // Provide user-friendly messages for common errors
    switch (code) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again';
      case 'UNAUTHORIZED':
        return 'Please log in to continue';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again';
      case 'NETWORK_ERROR':
      case 'CONNECTION_ERROR':
        return 'Unable to connect to server. Please check your internet connection';
      case 'TIMEOUT_ERROR':
        return 'Request timed out. Please try again';
      case 'OFFLINE_ERROR':
        return 'You appear to be offline. Please check your internet connection';
      default:
        return message || 'An unexpected error occurred';
    }
  }
}

export default ErrorHandler;