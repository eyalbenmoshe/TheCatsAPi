/**
 * Redux store configuration with persistence
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Action,
  configureStore,
  Middleware,
  ThunkAction,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { catsApi } from "./api/catsApi";
import favoritesReducer, { initializeFavorites } from "./slices/favoritesSlice";

// Persistence middleware to sync favorites to AsyncStorage
const persistenceMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    const result = next(action);

    // Save to storage whenever favorites change
    if (
      typeof action.type === "string" &&
      action.type.startsWith("favorites/") &&
      !action.type.includes("initialize")
    ) {
      try {
        const state = store.getState();
        await AsyncStorage.setItem(
          "favorites",
          JSON.stringify(state.favorites.ids)
        );
      } catch (error) {
        console.error("Failed to persist favorites:", error);
      }
    }

    return result;
  };

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    [catsApi.reducerPath]: catsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [catsApi.reducerPath],
        ignoredPaths: [catsApi.reducerPath],
      },
    })
      .concat(catsApi.middleware)
      .concat(persistenceMiddleware),
});

// Export types for use throughout the app
export type AppStore = typeof store;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// Hook to initialize favorites from storage
export const initializeFavoritesFromStorage = async () => {
  try {
    const stored = await AsyncStorage.getItem("favorites");
    if (stored) {
      const favorites = JSON.parse(stored);
      store.dispatch(initializeFavorites(favorites));
    } else {
      store.dispatch(initializeFavorites([]));
    }
  } catch (error) {
    console.error("Failed to load favorites from storage:", error);
    store.dispatch(initializeFavorites([]));
  }
};

export default store;
