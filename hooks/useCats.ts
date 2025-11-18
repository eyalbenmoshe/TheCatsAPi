/**
 * Hook for managing paginated cat list
 */

import { useCallback, useMemo, useState } from "react";
import { CATS_PER_PAGE } from "../constants/api";
import { useGetCatsQuery } from "../store/api/catsApi";
import type { Cat } from "../types/index";
import { calculateOffset } from "../utils/helpers";

export interface UseCatsReturn {
  cats: Cat[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * Custom hook for fetching and managing paginated cat list
 * Combines data from multiple pages into a single array
 */
export const useCats = (): UseCatsReturn => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate query parameters
  const offset = useMemo(
    () => calculateOffset(currentPage, CATS_PER_PAGE),
    [currentPage]
  );

  const queryParams = useMemo(
    () => ({
      limit: CATS_PER_PAGE,
      page: offset,
    }),
    [offset]
  );

  // Fetch cats from API
  const { data = [], isLoading, error, refetch } = useGetCatsQuery(queryParams);

  // Format error message
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if ("data" in error) return "Failed to load cats";
    if ("status" in error) return `Error: ${error.status}`;
    return "An error occurred while loading cats";
  }, [error]);

  // Check if there are more cats to load
  const hasMore = useMemo(() => data.length >= CATS_PER_PAGE, [data.length]);
 
  // Load next page
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Refresh current page
  const refresh = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  return {
    cats: data,
    isLoading,
    error: errorMessage,
    hasMore,
    currentPage,
    loadMore,
    refresh,
  };
};
