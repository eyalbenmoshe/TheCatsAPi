/**
 * RTK Query configuration for The Cat API
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CAT_API_BASE_URL, CAT_API_KEY } from "../../constants/api";
import type { Cat, CatsQuery } from "../../types/index";

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: `${CAT_API_BASE_URL}`,
  headers: {
    "x-api-key": CAT_API_KEY,
  },
});

export const catsApi = createApi({
  reducerPath: "catsApi",
  baseQuery,
  endpoints: (builder) => ({
    // Get paginated list of cats
    getCats: builder.query<Cat[], CatsQuery>({
      query: ({ limit, offset }) =>
        `/images/search?limit=${limit}&offset=${offset}`,
      // Merge paginated results
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    // Get a single cat by ID
    getCatById: builder.query<Cat, string>({
      query: (id) => `/images/${id}`,
    }),
  }),
});

export const { useGetCatsQuery, useGetCatByIdQuery } = catsApi;
