import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
};

export const UserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    handleToggleSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { handleToggleSidebar } = UserSlice.actions;

export default UserSlice.reducer;
