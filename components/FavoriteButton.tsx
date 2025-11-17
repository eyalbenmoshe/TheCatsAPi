import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Spacing } from "../constants/theme";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

/**
 * Heart icon button with useCallback optimization
 * Toggles favorite status with visual feedback
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
}) => {
  const styles = StyleSheet.create({
    button: {
      padding: Spacing.sm,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    icon: {
      fontSize: 24,
    },
  });

  // Memoized toggle callback
  const handlePress = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Text style={styles.icon}>{isFavorite ? "❤️" : "🤍"}</Text>
    </TouchableOpacity>
  );
};

export default FavoriteButton;
