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

// Persist configs for user and admin (now persisting everything)
const userPersistConfig = {
  key: "user",
  storage,
  // Remove the whitelist to persist everything in the user slice
};

const adminPersistConfig = {
  key: "admin",
  storage,
  // Remove the whitelist to persist everything in the admin slice
};

// Apply persistReducer to each slice
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
