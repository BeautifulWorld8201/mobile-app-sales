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
  },
});
export const { setUser, setApplicationStatus } = userSlice.actions;

export default userSlice.reducer;
