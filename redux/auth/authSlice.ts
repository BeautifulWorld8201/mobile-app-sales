import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    baseUrl: "",
    loginUser: {},
    accessToken: {},
    refreshToken: {},
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
    logOut: (state) => {
      state.accessToken = {};
      state.loginUser = {};
      state.refreshToken = {};
    },
  },
});

export const { setRefreshToken, logOut, setAccessToken, setLoginUser } =
  authSlice.actions;

export default authSlice.reducer;
