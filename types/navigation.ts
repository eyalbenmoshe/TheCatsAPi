/**
 * Navigation route and parameter types
 */

/**
 * Root stack parameter list for type-safe navigation
 */
export type RootStackParamList = {
  index: undefined;
  "[id]": {
    id: string;
  };
};

/**
 * Navigation state types
 */
export interface NavigationState {
  currentRoute: keyof RootStackParamList;
}
