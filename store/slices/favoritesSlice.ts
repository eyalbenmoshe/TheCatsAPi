/**
 * Redux slice for managing favorite cats
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FavoritesState, RootState } from "../../types/store";

const initialState: FavoritesState = {
  ids: [],
  isInitialized: false,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Add a cat to favorites
    addFavorite: (state, action: PayloadAction<string>) => {
      const catId = action.payload;
      if (!state.ids.includes(catId)) {
        state.ids.push(catId);
      }
    },

    // Remove a cat from favorites
    removeFavorite: (state, action: PayloadAction<string>) => {
      const catId = action.payload;
      state.ids = state.ids.filter((id) => id !== catId);
    },

    // Initialize favorites from storage
    initializeFavorites: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
      state.isInitialized = true;
    },

    // Clear all favorites
    clearFavorites: (state) => {
      state.ids = [];
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  initializeFavorites,
  clearFavorites,
} = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: RootState) => state.favorites.ids;
export const selectFavoritesCount = (state: RootState) =>
  state.favorites.ids.length;
export const selectIsFavorite = (state: RootState, catId: string) =>
  state.favorites.ids.includes(catId);
export const selectIsInitialized = (state: RootState) =>
  state.favorites.isInitialized;

export default favoritesSlice.reducer;
