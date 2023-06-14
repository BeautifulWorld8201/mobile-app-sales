import { createSlice } from "@reduxjs/toolkit";

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    selectedCards: [],
    currentSales: [],
  },
  reducers: {
    setSelectedCards: (state, action) => {
      state.selectedCards = action.payload;
    },

    setCurrentSales: (state, action) => {
      state.currentSales = action.payload;
    },

    clearSales: (state) => {
      state.selectedCards = [];
      state.currentSales = [];
    },
  },
});

export const { setSelectedCards, setCurrentSales, clearSales } =
  saleSlice.actions;

export default saleSlice.reducer;
