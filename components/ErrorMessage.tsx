import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";

interface ErrorMessageProps {
  message?: string;
  onRetry: () => void;
}

/**
 * Error message display with retry button
 * Shows user-friendly error messages and allows recovery from failures
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: Spacing.lg,
      backgroundColor: themeColors.background,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: Spacing.md,
    },
    message: {
      fontSize: Typography.sizes.md,
      color: themeColors.text,
      textAlign: "center",
      marginBottom: Spacing.lg,
      lineHeight: 22,
    },
    retryButton: {
      backgroundColor: Colors.light.error,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "#fff",
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorMessage;
