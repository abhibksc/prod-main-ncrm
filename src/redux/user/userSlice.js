import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  openTrades: [],
  loggedUser: "",
  platforms: [],
  paymentMethods: [],
  totalFinalPnL: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleToggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setOpenTrades: (state, action) => {
      state.openTrades = action.payload;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setPlatforms: (state, action) => {
      state.platforms = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    setTotalFinalPnL: (state, action) => {
      state.totalFinalPnL = action.payload;
    },
  },
});

export const {
  handleToggleSidebar,
  setLoggedUser,
  setOpenTrades,
  setPlatforms,
  setPaymentMethods,
  setTotalFinalPnL,
} = userSlice.actions;

export default userSlice.reducer;
