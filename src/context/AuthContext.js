"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  logout,
  refreshAccessToken,
} from "@/slices/authSlice"; // adjust import path
import ApiService from "@/lib/ApiServiceFunctions";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, accessToken, refreshToken, loading } = useSelector(
    (state) => state.auth
  );

  // Decode token & manage roles/permissions
  // useEffect(() => {
  //   try {
  //     if (!accessToken) {
  //       router.push("/login");
  //       return;
  //     }

  //     const decoded = jwtDecode(accessToken);
  //     ApiService?.setToken(accessToken);
  //     ApiService?.setRefreshToken(refreshToken);

  //     // Example: you can dispatch to store user details if needed
  //     // dispatch(setUser(decoded));
  //   } catch (error) {
  //     console.error("Token decode error:", error);
  //     dispatch(logout());
  //     router.push("/login");
  //   }
  // }, []);

  // ⏱️ Auto-refresh token every 10 minutes
  // useEffect(() => {
  //   if (!refreshToken) return;

  //   const refreshFn = async () => {
  //     dispatch(refreshAccessToken(refreshToken));
  //   };

  //   refreshFn();
  //   const interval = setInterval(refreshFn, 10 * 60 * 1000); // every 10 minutes

  //   return () => clearInterval(interval);
  // }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        logout: () => dispatch(logout()),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
