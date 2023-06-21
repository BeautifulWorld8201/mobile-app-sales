import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    baseUrl: "",
    loginUser: {},
    accessToken: {},
    refreshToken: {},
    isTokenValid: false,
    referralCode: null,
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
    setReferralCode: (state, action) => {
      console.log('setting referral code to', action?.payload)
      state.referralCode = action?.payload;
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
  setReferralCode,
} = authSlice.actions;

export default authSlice.reducer;
