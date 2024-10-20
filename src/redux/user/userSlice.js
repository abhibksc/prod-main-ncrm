import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  depositBalance: 0,
  availableBalance: 0,
  profitNloss: 0,
  openTrades: [],
  closeTrades: [],
  userInfo: "",
  loggedUser: "",
  platforms: [],
  paymentMethods: [],
  phaseMaxLength: 0,
  totalFinalPnL: 0,
  phaseStats: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleToggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
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
    setPhaseStats: (state, action) => {
      state.phaseStats = action.payload;
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
  setPhaseStats,
} = userSlice.actions;

export default userSlice.reducer;
