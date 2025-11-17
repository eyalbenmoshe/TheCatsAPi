/**
 * Redux store state types
 */

/**
 * Favorites slice state
 */
export interface FavoritesState {
  ids: string[];
  isInitialized: boolean;
}

/**
 * Root Redux state
 */
export interface RootState {
  favorites: FavoritesState;
}

/**
 * Redux dispatch type
 */
export type AppDispatch = any; // Will be properly typed when store is created
