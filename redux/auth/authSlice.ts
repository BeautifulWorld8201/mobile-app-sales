import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    baseUrl: "",
    loginUser: {},
    authToken: {},
    refreshToken: {},
  },
  reducers: {
    setRefreshToken: (state, action) => {
      state.refreshToken = action?.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action?.payload;
    },
    setLoginUser: (state, action) => {
      state.loginUser = action?.payload;
    },
    logOut: (state, action) => {
      state.authToken = {};
      state.loginUser = {};
      state.refreshToken = {};
    },
  },
});

export const { setRefreshToken, logOut, setAuthToken, setLoginUser } =
  authSlice.actions;

export default authSlice.reducer;
