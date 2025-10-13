import ApiEndPoints from "@/lib/ApiServiceEndpoint";
import ApiService from "@/lib/ApiServiceFunctions";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {},
    login: () => {},
    signUp: () => {},
    refreshAccessToken: async (state) => {
      try {
        const token = ApiService?.getRefreshToken();
        if (!token) {
          return;
        }
        const response = await ApiService.post(
          `${ApiEndPoints?.refreshToken}?refresh_token=${token}`,
          {},
          {
            headers: {
              refresh_token: token,
            },
            withCredentials: true,
          }
        );

        const data = response.data;

        state.accessToken = data?.access_token;
        state.refreshToken = data?.refresh_token;
        ApiService?.setToken(data?.access_token);
        ApiService?.setRefreshToken(data?.refresh_token);
        if (true) {
          //authModeDev
          localStorage.setItem("token", data?.access_token);
          localStorage.setItem("refresh_token", data?.refresh_token);
        }
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    },
  },
});

export const { logout, login, signUp, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
