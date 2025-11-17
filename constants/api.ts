/**
 * API configuration constants
 */

// The Cat API base configuration
export const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";
export const CAT_API_KEY =
  "live_VmQOLtk4O8ZpTj0dPTwd3D6mGujtsqKWF3oaYLTL6ylN78pxJvfJiWfdSe5iORcJ";

// Pagination configuration
export const CATS_PER_PAGE = 12;

// Cache configuration
export const CACHE_TIME_MINUTES = 5;
export const CACHE_TIME_SECONDS = CACHE_TIME_MINUTES * 60;

// API Endpoints
export const ENDPOINTS = {
  CATS: "/images/search",
  CAT_BY_ID: "/images/{id}",
} as const;

// Default API headers
export const DEFAULT_HEADERS = {
  "x-api-key": CAT_API_KEY,
  "Content-Type": "application/json",
} as const;
