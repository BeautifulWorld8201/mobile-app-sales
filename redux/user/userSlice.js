import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    servicesAreas: [],
    languages: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setServiceAreas: (state, action) => {
      state.servicesAreas = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
  },
});
export const { setUser, setServiceAreas, setLanguages } = userSlice.actions;

export default userSlice.reducer;
