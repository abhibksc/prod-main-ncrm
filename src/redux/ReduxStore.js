import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";

const ReduxStore = configureStore({
  reducer: {
    user: userSlice,
  },
});
export default ReduxStore;
