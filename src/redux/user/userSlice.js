import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  depositBalance: "",
  availableBalance: "00",
  profitNloss: "00",
  openTrades: [],
  closeTrades: [],
  userInfo: "",
  loggedUser: "",
  platforms: [],
  paymentMethods: [],
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleToggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
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
} = UserSlice.actions;

export default UserSlice.reducer;
