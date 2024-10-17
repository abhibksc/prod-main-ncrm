import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import adminSlice from "./adminSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage engine

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user"], // Ensure only user data is persisted
};

const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["admin"], // Ensure only admin data is persisted
};

const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminSlice);

const ReduxStore = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
  },
});

export const persistor = persistStore(ReduxStore);

export default ReduxStore;
