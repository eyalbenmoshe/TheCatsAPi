/**
 * Hook for favorites management backed by Redux
 */

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
  selectFavorites,
  selectFavoritesCount
} from "../store/slices/favoritesSlice";
import type { AppDispatch } from "../store/store";

export const useFavorites = (catId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(selectFavorites);
  const count = useSelector(selectFavoritesCount);

  const isFavorite = useMemo(() => {
    if (!catId) return false;
    return favorites.includes(catId);
  }, [favorites, catId]);

  const toggleFavorite = useCallback(() => {
    if (!catId) return;
    if (favorites.includes(catId)) {
      dispatch(removeFavorite(catId));
    } else {
      dispatch(addFavorite(catId));
    }
  }, [dispatch, catId, favorites]);

  return {
    favorites,
    count,
    isFavorite,
    toggleFavorite,
  } as const;
};
