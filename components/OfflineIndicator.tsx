import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../constants/theme";

interface OfflineIndicatorProps {
  isOnline: boolean;
}

/**
 * Red banner indicator displayed when device is offline
 * Shows and hides smoothly based on network connection status
 */
const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  // Show indicator only when offline
  const { top, bottom } = useSafeAreaInsets();
  if (!isOnline) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: top,
      left: 0,
      right: 0,
      backgroundColor: Colors.light.error,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: "#fff",
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
    },
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.text}>🔌 You are offline</Text>
      </View>
    </SafeAreaView>
  );
};

export default OfflineIndicator;
