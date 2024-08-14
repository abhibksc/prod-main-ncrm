import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  currentAccount: "",
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
  },
});

export const { handleToggleSidebar, setCurrentAccount } = UserSlice.actions;

export default UserSlice.reducer;
