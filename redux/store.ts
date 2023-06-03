import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import saleReducer from "./sale/saleSlice";
const rootReduer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  user: userReducer,
  sale: saleReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "sale"],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReduer);

const root = (state, action) => {
  if (action.type === "auth/logOut") {
    return persistedReducer(state, action);

    // AsyncStorage.removeItem("persist:root");
    // return persistedReducer(undefined, action);
  } else {
    return persistedReducer(state, action);
  }
};
export const store = configureStore({
  reducer: root,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),

  // devTools: true
});
export const persistor = persistStore(store);
