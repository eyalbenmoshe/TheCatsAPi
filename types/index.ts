/**
 * Core domain types for The Cat API
 */

/**
 * Breed information from The Cat API
 */
export interface Breed {
  id: string;
  name: string;
  temperament?: string;
  description?: string;
  origin?: string;
  wikipedia_url?: string;
}

/**
 * Cat object from The Cat API
 */
export interface Cat {
  id: string;
  url: string;
  breeds?: Breed[];
  width?: number;
  height?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * API response wrapper for paginated cat list
 */
export interface CatsResponse {
  data: Cat[];
  pagination?: {
    limit: number;
    page: number;
  };
}

/**
 * Query parameters for fetching cats
 */
export interface CatsQuery {
  limit: number;
  page: number;
}
