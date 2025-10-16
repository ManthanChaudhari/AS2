import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ApiService from '@/lib/ApiServiceFunctions';
import ErrorHandler from '@/lib/errorHandler';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  clearError,
  updateUser
} from '@/slices/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, accessToken, refreshToken, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const [refreshInterval, setRefreshInterval] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = Boolean(user && accessToken);

  // Login method
  const login = useCallback(async (credentials) => {
    dispatch(loginStart());

    const result = await ApiService.loginUser(credentials);

    if (result.error) {
      dispatch(loginFailure(result.error.message));
      return result;
    }

    const { access_token, refresh_token, user: userData } = result.data;

    // Store tokens in ApiService
    ApiService.setToken(access_token);
    ApiService.setRefreshToken(refresh_token);

    // Store tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }

    // Update Redux state
    dispatch(loginSuccess({
      user: userData,
      accessToken: access_token,
      refreshToken: refresh_token
    }));

    return result;
  }, [dispatch]);

  // Logout method
  const logout = useCallback(async (showMessage = true, reason = 'logout') => {
    // Call logout API
    await ApiService.logoutUser();

    // Clear tokens from ApiService
    ApiService.clearTokens();

    // Clear refresh interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }

    // Update Redux state
    dispatch(logoutAction());

    // Show appropriate message based on reason
    if (showMessage) {
      switch (reason) {
        case 'session_expired':
          toast.error('Your session has expired. Please log in again.');
          break;
        case 'token_refresh_failed':
          toast.error('Unable to refresh your session. Please log in again.');
          break;
        case 'invalid_token':
          toast.error('Invalid session detected. Please log in again.');
          break;
        case 'logout':
        default:
          toast.success('You have been logged out successfully.');
          break;
      }
    }

    // Redirect to login
    router.push('/login');
  }, [dispatch, router, refreshInterval]);

  // Register method
  const register = useCallback(async (userData) => {
    dispatch(loginStart()); // Using same loading state

    const result = await ApiService.registerUser(userData);

    if (result.error) {
      dispatch(loginFailure(result.error.message));
      return result;
    }

    // Registration successful - user might need to verify email
    // Don't automatically log them in, just return success
    dispatch(clearError());
    return result;
  }, [dispatch]);

  // Get current user method
  const getCurrentUser = useCallback(async () => {
    const result = await ApiService.getCurrentUser();

    if (result.error) {
      // If unauthorized, logout user with appropriate message
      if (result.error.status === 401) {
        await logout(true, 'session_expired');
      }
      return result;
    }

    // Update user data in Redux state
    dispatch(loginSuccess({
      user: result.data,
      accessToken,
      refreshToken
    }));

    return result;
  }, [dispatch, accessToken, refreshToken, logout]);

  // Refresh token method
  const refreshTokens = useCallback(async () => {
    dispatch(refreshTokenStart());

    const result = await ApiService.refreshAccessToken();

    if (result.error) {
      dispatch(refreshTokenFailure());
      // If refresh fails, logout user with appropriate message
      await logout(true, 'token_refresh_failed');
      return result;
    }

    const { access_token, refresh_token: newRefreshToken } = result.data;

    // Store new tokens in ApiService
    ApiService.setToken(access_token);
    ApiService.setRefreshToken(newRefreshToken);

    // Store new tokens in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', access_token);
      localStorage.setItem('refresh_token', newRefreshToken);
    }

    // Update Redux state
    dispatch(refreshTokenSuccess({
      accessToken: access_token,
      refreshToken: newRefreshToken
    }));

    return result;
  }, [dispatch, logout]);

  // Clear error method
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Start automatic refresh
  const startAutoRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(async () => {
      console.log('Auto-refreshing token...');
      const result = await refreshTokens();

      if (result && result.error) {
        console.error('Auto-refresh failed:', result.error);
      }
    }, 10 * 60 * 1000); // 10 minutes

    setRefreshInterval(interval);
  }, [refreshTokens, refreshInterval]);

  // Stop automatic refresh
  const stopAutoRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [refreshInterval]);

  // Update user profile
  const updateUserProfile = useCallback((userData) => {
    dispatch(updateUser(userData));
  }, [dispatch]);

  // Get user role and permissions
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasPermission = useCallback((permission) => {
    // This can be expanded based on your permission system
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  // Check session validity
  const isSessionValid = useCallback(() => {
    if (!isAuthenticated) return false;

    const token = ApiService.getAcessToken();
    const refresh = ApiService.getRefreshToken();

    return (
      ApiService.isValidTokenFormat(token) &&
      ApiService.isValidTokenFormat(refresh) &&
      !ApiService.isTokenExpired(token)
    );
  }, [isAuthenticated]);

  // Force session validation
  const validateSession = useCallback(async () => {
    if (!isAuthenticated) return false;

    // Check if tokens are valid
    if (!isSessionValid()) {
      // Try to refresh tokens
      const result = await refreshTokens();
      if (result.error) {
        // Refresh failed, logout user (message already shown in refreshTokens)
        await logout(false);
        return false;
      }
    }

    // Verify with server
    const userResult = await getCurrentUser();
    if (userResult.error) {
      // Server validation failed, logout user (message already shown in getCurrentUser)
      await logout(false);
      return false;
    }

    return true;
  }, [isAuthenticated, isSessionValid, refreshTokens, logout, getCurrentUser]);

  // Session expiration warning
  const checkSessionExpiration = useCallback(() => {
    if (!isAuthenticated) return;

    const token = ApiService.getAcessToken();
    if (!token) return;

    const expiration = ApiService.getTokenExpiration(token);
    if (!expiration) return;

    const now = new Date();
    const timeUntilExpiry = expiration.getTime() - now.getTime();
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));

    // Warn user if session expires in 5 minutes or less
    if (minutesUntilExpiry <= 5 && minutesUntilExpiry > 0) {
      toast.warning(`Your session will expire in ${minutesUntilExpiry} minute(s). Activity will extend your session.`);
    }
  }, [isAuthenticated]);

  // Session restoration on app load
  const restoreSession = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedToken && storedRefreshToken) {
      // Set tokens in ApiService
      ApiService.setToken(storedToken);
      ApiService.setRefreshToken(storedRefreshToken);

      // Try to get current user to validate token
      const result = await getCurrentUser();

      if (result.error) {
        // Token is invalid, clear everything
        ApiService.clearTokens();
        dispatch(logoutAction());
        // Don't show message for silent session restoration failure
      } else {
        // Token is valid, update Redux state
        dispatch(loginSuccess({
          user: result.data,
          accessToken: storedToken,
          refreshToken: storedRefreshToken
        }));
      }
    }
  }, [dispatch, getCurrentUser]);

  // Initialize session restoration on mount
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      restoreSession();
    }
  }, [restoreSession, isAuthenticated, isLoading]);

  // Automatic token refresh mechanism
  useEffect(() => {
    if (isAuthenticated && refreshToken) {
      // Set up automatic refresh every 10 minutes (600,000 ms)
      const interval = setInterval(async () => {
        console.log('Auto-refreshing token...');

        // Check if token is close to expiring before refreshing
        const currentToken = ApiService.getAcessToken();
        if (ApiService.isTokenExpired(currentToken)) {
          console.log('Token is expired or close to expiring, refreshing...');

          const result = await refreshTokens();

          if (result && result.error) {
            console.error('Auto-refresh failed:', result.error);
            // The refreshTokens method will handle logout on failure
          } else {
            console.log('Token refreshed successfully');
          }
        } else {
          console.log('Token is still valid, skipping refresh');
        }
      }, 10 * 60 * 1000); // 10 minutes

      setRefreshInterval(interval);

      // Cleanup function
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      // Clear interval if user is not authenticated
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [isAuthenticated, refreshToken, refreshTokens, refreshInterval]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Methods
    login,
    logout,
    register,
    getCurrentUser,
    refreshToken: refreshTokens,
    clearError: clearAuthError,
    restoreSession,
    startAutoRefresh,
    stopAutoRefresh,
    updateUserProfile,

    // Utility methods
    hasRole,
    hasPermission,
    isSessionValid,
    validateSession,
    checkSessionExpiration,

    // Internal state for refresh interval management
    setRefreshInterval
  };
};

export default useAuth;