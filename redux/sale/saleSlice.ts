import { createSlice } from "@reduxjs/toolkit";

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    selectedCards: [],
  },
  reducers: {
    setSelectedCards: (state, action) => {
      state.selectedCards = action.payload;
    },
  },
});

export const { setSelectedCards } = saleSlice.actions;

export default saleSlice.reducer;
