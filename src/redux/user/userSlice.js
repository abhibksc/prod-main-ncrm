import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  currentAccount: "00",
  currentUser: "00",
  depositBalace: "00",
  availableBalance: "00",
  profitNloss: "00",
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
      state.depositBalace = action.payload;
    },
    setAvailableBalance: (state, action) => {
      state.availableBalance = action.payload;
    },
    setProfitNloss: (state, action) => {
      state.profitNloss = action.payload;
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
} = UserSlice.actions;

export default UserSlice.reducer;
