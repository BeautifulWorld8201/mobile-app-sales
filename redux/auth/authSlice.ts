import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    baseUrl: "",
    loginUser: {},
    accessToken: {},
    refreshToken: {},
    isTokenValid: false,
  },
  reducers: {
    setRefreshToken: (state, action) => {
      state.refreshToken = action?.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action?.payload;
    },
    setLoginUser: (state, action) => {
      state.loginUser = action?.payload;
    },
    setIsTokenValid: (state, action) => {
      state.isTokenValid = action?.payload;
    },
    logOut: (state) => {
      state.accessToken = {};
      state.loginUser = {};
      state.refreshToken = {};
    },
  },
});

export const {
  setRefreshToken,
  logOut,
  setAccessToken,
  setLoginUser,
  setIsTokenValid,
} = authSlice.actions;

export default authSlice.reducer;
