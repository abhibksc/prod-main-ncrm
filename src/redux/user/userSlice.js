import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  depositBalance: 0, // As number
  availableBalance: 0, // As number
  profitNloss: 0, // As number
  openTrades: [],
  closeTrades: [],
  userInfo: "",
  loggedUser: "",
  platforms: [],
  paymentMethods: [],
  phaseMaxLength: 0,
  totalFinalPnL: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleToggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen; // Toggle between true/false
    },
    setDepositBalance: (state, action) => {
      state.depositBalance = action.payload;
    },
    setAvailableBalance: (state, action) => {
      state.availableBalance = action.payload;
    },
    setProfitNloss: (state, action) => {
      state.profitNloss = action.payload;
    },
    setOpenTrades: (state, action) => {
      state.openTrades = action.payload;
    },
    setCloseTrades: (state, action) => {
      state.closeTrades = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
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
    setPhaseMaxLength: (state, action) => {
      state.phaseMaxLength = action.payload;
    },
    setTotalFinalPnL: (state, action) => {
      state.totalFinalPnL = action.payload;
    },
  },
});

export const {
  handleToggleSidebar,
  setDepositBalance,
  setAvailableBalance,
  setProfitNloss,
  setUserInfo,
  setLoggedUser,
  setOpenTrades,
  setCloseTrades,
  setPlatforms,
  setPaymentMethods,
  setPhaseMaxLength,
  setTotalFinalPnL,
} = userSlice.actions;

export default userSlice.reducer;
