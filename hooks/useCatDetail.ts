/**
 * Hook for fetching single cat details
 */

import { useMemo } from "react";
import { useGetCatByIdQuery } from "../store/api/catsApi";
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
  // Skip query if no ID provided
  const { data, isLoading, error, refetch } = useGetCatByIdQuery(catId || "", {
    skip: !catId,
  });

  // Format error message
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (typeof error === "string") return error;
    if ("data" in error) return "Failed to load cat details";
    if ("status" in error) return `Error: ${error.status}`;
    return "An error occurred";
  }, [error]);

  return {
    cat: data || null,
    isLoading,
    error: errorMessage,
    refetch,
  };
};
