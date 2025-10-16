"use client";

import { createContext, useContext, useMemo, useEffect, useState } from "react";
import useAuthHook from "@/hooks/useAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the auth provider and restore session
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        const hasStoredTokens = localStorage.getItem('token') && localStorage.getItem('refresh_token');
        
        if (hasStoredTokens && !auth.isAuthenticated && !auth.isLoading) {
          // Try to restore session
          await auth.restoreSession();
        }
      }
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, [auth.restoreSession, auth.isAuthenticated, auth.isLoading]);

  // Debug: Log authentication state changes in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth state changed:', {
        isAuthenticated: auth.isAuthenticated,
        user: auth.user?.email || 'No user',
        isLoading: auth.isLoading,
        error: auth.error,
        isInitialized
      });
    }
  }, [auth.isAuthenticated, auth.user, auth.isLoading, auth.error, isInitialized]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || !isInitialized,
    error: auth.error,
    isInitialized,
    
    // Methods
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    getCurrentUser: auth.getCurrentUser,
    refreshToken: auth.refreshToken,
    clearError: auth.clearError,
    restoreSession: auth.restoreSession,
    updateUserProfile: auth.updateUserProfile,
    
    // Utility methods
    hasRole: auth.hasRole,
    hasPermission: auth.hasPermission,
    
    // Auto-refresh controls
    startAutoRefresh: auth.startAutoRefresh,
    stopAutoRefresh: auth.stopAutoRefresh,
  }), [auth, isInitialized]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export the context for advanced use cases
export { AuthContext };
