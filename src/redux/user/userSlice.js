import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  currentAccount: "00",
  currentUser: "00",
  depositBalance: "",
  availableBalance: "00",
  profitNloss: "00",
  isRefreshed: true,
  investorPassword: "",
  masterPassword: "",
  openTrades: [],
  closeTrades: [],
  phase: 0,
  userInfo: "",
  loggedUser: "",
  platforms: [],
  paymentMethods: [],
  userFormData: "",
  signUpData: "",
};

export const UserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    handleToggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
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
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setIsRefresh: (state) => {
      state.isRefreshed = !state.isRefreshed;
    },
    setLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setInvestorPassword: (state, action) => {
      state.investorPassword = action.payload;
    },
    setMasterPassword: (state, action) => {
      state.masterPassword = action.payload;
    },
    setOpenTrades: (state, action) => {
      state.openTrades = action.payload;
    },
    setCloseTrades: (state, action) => {
      state.closeTrades = action.payload;
    },
    setPhase: (state, action) => {
      state.phase = action.payload;
    },
    setPlatforms: (state, action) => {
      state.platforms = action.payload;
    },
    setPaymentMethods: (state, action) => {
      state.paymentMethods = action.payload;
    },
    setUserFormData: (state, action) => {
      state.userFormData = action.payload;
    },
    setSignUpData: (state, action) => {
      state.signUpData = action.payload;
    },
  },
});

export const {
  handleToggleSidebar,
  setCurrentAccount,
  setCurrentUser,
  setDepositBalance,
  setAvailableBalance,
  setProfitNloss,
  setUserInfo,
  setIsRefresh,
  setLoggedUser,
  setInvestorPassword,
  setMasterPassword,
  setOpenTrades,
  setCloseTrades,
  setPhase,
  setPlatforms,
  setPaymentMethods,
  setUserFormData,
  setSignUpData,
} = UserSlice.actions;

export default UserSlice.reducer;
