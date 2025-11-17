/**
 * Theme and styling constants
 */

export const Colors = {
  // Light mode colors
  light: {
    text: "#000",
    background: "#fff",
    tint: "#0a7ea4",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
    border: "#e0e0e0",
    error: "#dc2626",
    success: "#16a34a",
  },
  // Dark mode colors
  dark: {
    text: "#ecedeb",
    background: "#151718",
    tint: "#64b5f6",
    tabIconDefault: "#9ca3af",
    tabIconSelected: "#64b5f6",
    border: "#404040",
    error: "#ef4444",
    success: "#22c55e",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
