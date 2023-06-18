import { createSlice } from "@reduxjs/toolkit";
import { getLocales } from "expo-localization";

const languageSlice = createSlice({
  name: "language",
  initialState: getLocales()[0].languageCode,
  reducers: {
    setLanguage: (state, action) => {
      return action.payload;
    },
  },
});
export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
