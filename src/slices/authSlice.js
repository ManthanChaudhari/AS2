import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  lastRefresh: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.lastRefresh = Date.now();
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    
    // Logout action
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = null;
      state.lastRefresh = null;
    },
    
    // Refresh token actions
    refreshTokenStart: (state) => {
      state.error = null;
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.lastRefresh = Date.now();
      state.error = null;
    },
    refreshTokenFailure: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = "Session expired. Please login again.";
      state.lastRefresh = null;
    },
    
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user action (for profile updates)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  clearError,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
