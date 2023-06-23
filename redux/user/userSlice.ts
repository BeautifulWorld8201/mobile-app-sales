import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    applicationStatus: "",
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setApplicationStatus: (state, action) => {
      state.applicationStatus = action.payload;
    },
    clearUser: (state) => {
      state.user = {};
      state.applicationStatus = "";
    },
  },
});
export const { setUser, setApplicationStatus, clearUser } = userSlice.actions;

export default userSlice.reducer;
