/**
 * Authentication Integration Example
 * 
 * This component demonstrates how all authentication components work together:
 * - ApiServiceEndpoint: Provides centralized endpoint definitions
 * - ApiServiceFunctions: Handles API calls with automatic token management
 * - useAuth hook: Manages authentication state and operations
 * - AuthProvider: Provides global authentication context
 * - ErrorHandler: Handles errors consistently across the system
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ErrorHandler from '@/lib/errorHandler';

const AuthIntegrationExample = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    getCurrentUser,
    refreshToken,
    clearError,
    hasRole,
    hasPermission,
    isSessionValid,
    validateSession
  } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [registrationData, setRegistrationData] = useState({
    email: '',
    password: '',
    name: '',
    organization: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await login(credentials);
    
    if (result.error) {
      console.error('Login failed:', ErrorHandler.getUserMessage(result));
    } else {
      console.log('Login successful:', result.data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const result = await register(registrationData);
    
    if (result.error) {
      console.error('Registration failed:', ErrorHandler.getUserMessage(result));
    } else {
      console.log('Registration successful:', result.data);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleRefreshToken = async () => {
    const result = await refreshToken();
    
    if (result.error) {
      console.error('Token refresh failed:', ErrorHandler.getUserMessage(result));
    } else {
      console.log('Token refreshed successfully');
    }
  };

  const handleGetCurrentUser = async () => {
    const result = await getCurrentUser();
    
    if (result.error) {
      console.error('Get user failed:', ErrorHandler.getUserMessage(result));
    } else {
      console.log('Current user:', result.data);
    }
  };

  const handleValidateSession = async () => {
    const isValid = await validateSession();
    console.log('Session is valid:', isValid);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading authentication...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Authentication Integration Example</h1>
      
      {/* Authentication Status */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Session Valid:</strong> {isSessionValid() ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>User:</strong> {user?.email || 'None'}
          </div>
          <div>
            <strong>Role:</strong> {user?.role || 'None'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'None'}
          </div>
        </div>
        
        {error && (
          <div className="mt-4">
            <button
              onClick={clearError}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Error
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>

          {/* Registration Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={registrationData.password}
                  onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Organization</label>
                <input
                  type="text"
                  value={registrationData.organization}
                  onChange={(e) => setRegistrationData({...registrationData, organization: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Name:</strong> {user?.name}</div>
              <div><strong>Email:</strong> {user?.email}</div>
              <div><strong>Role:</strong> {user?.role}</div>
              <div><strong>Organization:</strong> {user?.organization?.name}</div>
              <div><strong>Is Admin:</strong> {hasRole('admin') ? 'Yes' : 'No'}</div>
              <div><strong>Last Login:</strong> {user?.lastLogin}</div>
            </div>
          </div>

          {/* Authentication Actions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Authentication Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={handleRefreshToken}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Token
              </button>
              <button
                onClick={handleGetCurrentUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Get Current User
              </button>
              <button
                onClick={handleValidateSession}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Validate Session
              </button>
            </div>
          </div>

          {/* Permission Examples */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Permission Examples</h2>
            <div className="space-y-2">
              <div>Can manage users: {hasPermission('manage_users') ? 'Yes' : 'No'}</div>
              <div>Can view reports: {hasPermission('view_reports') ? 'Yes' : 'No'}</div>
              <div>Is admin: {hasRole('admin') ? 'Yes' : 'No'}</div>
              <div>Is user: {hasRole('user') ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Notes */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Integration Notes</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><strong>ApiServiceEndpoint:</strong> Provides centralized endpoint definitions matching OpenAPI spec</li>
          <li><strong>ApiServiceFunctions:</strong> Handles all API calls with automatic token inclusion and refresh retry</li>
          <li><strong>useAuth Hook:</strong> Manages authentication state with automatic token refresh every 10 minutes</li>
          <li><strong>AuthProvider:</strong> Provides global authentication context with session restoration</li>
          <li><strong>ErrorHandler:</strong> Provides consistent error handling and user-friendly messages</li>
          <li><strong>Redux Integration:</strong> Maintains authentication state across the application</li>
          <li><strong>Automatic Features:</strong> Token refresh, session restoration, error handling, and logout on failures</li>
        </ul>
      </div>
    </div>
  );
};

export default AuthIntegrationExample;