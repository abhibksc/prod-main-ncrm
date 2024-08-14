import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Def

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice);

const ReduxStore = configureStore({
  reducer: {
    user: persistedReducer,
  },
});
export const persistor = persistStore(ReduxStore);

export default ReduxStore;
