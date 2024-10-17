import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import userSlice from "./user/userSlice";
import adminSlice from "./adminSlice";

// Separate persist configs for user and admin
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user"], // Persist only user slice state
};

const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["admin"], // Persist only admin slice state
};

// Apply persistReducer to each slice separately
const persistedUserReducer = persistReducer(userPersistConfig, userSlice);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminSlice);

const rootReducer = combineReducers({
  user: persistedUserReducer,
  admin: persistedAdminReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
