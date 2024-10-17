import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminUser: "",
};

export const adminSlice = createSlice({
  name: "adminSlice",
  initialState,
  reducers: {
    setAdminUser: (state, action) => {
      state.adminUser = action.payload;
    },
  },
});

export const { setAdminUser } = adminSlice.actions;

export default adminSlice.reducer;
