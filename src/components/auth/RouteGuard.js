"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * RouteGuard component to protect routes based on authentication status
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.redirectTo - Where to redirect if auth requirement not met
 * @param {boolean} props.showLoading - Whether to show loading spinner (default: true)
 */
export default function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = null,
  showLoading = true 
}) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth context to initialize
    if (!isInitialized || isLoading) {
      return;
    }

    if (requireAuth && !isAuthenticated) {
      const redirect = "/login";
      router.push(redirect);
      return;
    }

    if (!requireAuth && isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectParam = urlParams.get('redirect');
      
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        const redirect = redirectTo || '/dashboard';
        router.push(redirect);
      }
      return;
    }

    // Auth check complete
    setIsChecking(false);
  }, [isAuthenticated, isLoading, isInitialized, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading || !isInitialized || isChecking) {
    if (!showLoading) {
      return null;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children if auth check passes
  return <>{children}</>;
}


export function withAuthRequired(Component, redirectTo = '/login') {
  return function AuthRequiredComponent(props) {
    return (
      <RouteGuard requireAuth={true} redirectTo={redirectTo}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

export function withAuthNotRequired(Component, redirectTo = '/dashboard') {
  return function AuthNotRequiredComponent(props) {
    return (
      <RouteGuard requireAuth={false} redirectTo={redirectTo}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}