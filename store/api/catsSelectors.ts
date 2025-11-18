import { createSelector } from "reselect";
import type { AppState } from "../store";
import type { Cat } from "../../types";

// מחזיר את כל החתולים מה-cache של getCats (RTK Query)
export const selectAllCats = createSelector(
  [(state: AppState) => (state as any).catsApi?.queries],
  (queries): Cat[] => {
    if (!queries) return [];
    return Object.keys(queries)
      .filter((key) => key.startsWith("getCats"))
      .map((key) => queries[key]?.data)
      .filter(Boolean)
      .flat();
  }
);
