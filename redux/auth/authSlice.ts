import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    baseUrl: "",
    loginUser: {},
    authToken: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.loginUser = action.payload;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    logOut: (state, action) => {
      state.authToken = null;
      state.loginUser = {};
    },
  },
});

export const { setToken, logOut, setAuthToken } = authSlice.actions;

export default authSlice.reducer;
