/**
 * Hook for fetching single cat details
 */

import { useMemo } from "react";
import { selectAllCats } from "../store/api/catsSelectors";
import { useAppSelector } from "../store/store";
import type { Cat } from "../types/index";

export interface UseCatDetailReturn {
  cat: Cat | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching a single cat's details
 */
export const useCatDetail = (catId: string | undefined): UseCatDetailReturn => {
  // שליפת כל החתולים מהסטייט (cache של RTK Query) עם selector ממואז
  const cats = useAppSelector(selectAllCats);

  const cat = useMemo(() => {
    if (!catId) return null;
    return cats.find((c: Cat) => c.id === catId) || null;
  }, [catId, cats]);

  return {
    cat,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
};
