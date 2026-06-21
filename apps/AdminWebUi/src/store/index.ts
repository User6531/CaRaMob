import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "./persistStorage";
import driversFiltersReducer from "./slices/driversFiltersSlice";
import vehiclesFiltersReducer from "./slices/vehiclesFiltersSlice";

const persistConfig = {
  key: "admin-filters",
  storage,
  whitelist: ["driversFilters", "vehiclesFilters"],
};

const rootReducer = combineReducers({
  driversFilters: driversFiltersReducer,
  vehiclesFilters: vehiclesFiltersReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
