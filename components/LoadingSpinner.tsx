import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Colors, Spacing } from "../constants/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
}

/**
 * Activity indicator component for displaying loading states
 * Used during API calls and data fetching
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  const indicatorColor = color || themeColors.tint;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeColors.background,
      paddingVertical: Spacing.xl,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );
};

export default LoadingSpinner;
