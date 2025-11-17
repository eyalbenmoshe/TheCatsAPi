/**
 * Utility helper functions
 */

import type { Cat } from "../types/index";

/**
 * Get the primary breed name from a cat's breeds array
 */
export const getCatBreedName = (cat: Cat): string => {
  if (cat.breeds && cat.breeds.length > 0) {
    return cat.breeds[0].name;
  }
  return "Unknown Breed";
};

/**
 * Get the primary breed temperament from a cat's breeds array
 */
export const getCatTemperament = (cat: Cat): string => {
  if (cat.breeds && cat.breeds.length > 0) {
    return cat.breeds[0].temperament || "Not specified";
  }
  return "Not specified";
};

/**
 * Get the primary breed description from a cat's breeds array
 */
export const getCatDescription = (cat: Cat): string => {
  if (cat.breeds && cat.breeds.length > 0) {
    return cat.breeds[0].description || "No description available";
  }
  return "No description available";
};

/**
 * Format offset for API pagination
 */
export const calculateOffset = (page: number, itemsPerPage: number): number => {
  return (page - 1) * itemsPerPage;
};

/**
 * Check if a value is empty
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};
