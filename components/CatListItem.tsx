import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { Cat } from "../types";

interface CatListItemProps {
  cat: Cat;
  isFavorite: boolean;
  onPress: () => void;
}

/**
 * Memoized list item component displaying a cat with image, name, breed, and favorite indicator
 * Prevents unnecessary re-renders with custom comparison
 */
const CatListItem = React.memo(
  ({ cat, isFavorite, onPress }: CatListItemProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const themeColors = isDark ? Colors.dark : Colors.light;

    const styles = useMemo(() => createStyles(themeColors), [themeColors]);

    // Get breed name from first breed, or fallback
    const breedName = cat.breeds?.[0]?.name || "Unknown Breed";

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Cat Image */}
        <Image
          source={{ uri: cat.url }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Indicator */}
        <View style={styles.favoriteIndicator}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
        </View>

        {/* Cat Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {cat.id}
          </Text>
          <Text style={styles.breed} numberOfLines={1}>
            {breedName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if cat ID, favorite status, or onPress callback changes
    return (
      prevProps.cat.id === nextProps.cat.id &&
      prevProps.isFavorite === nextProps.isFavorite &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

CatListItem.displayName = "CatListItem";

const createStyles = (themeColors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      margin: Spacing.sm,
      borderRadius: BorderRadius.lg,
      overflow: "hidden",
      ...Shadows.md,
      backgroundColor: themeColors.background,
    },
    image: {
      width: "100%",
      aspectRatio: 1,
      backgroundColor: themeColors.border,
    },
    favoriteIndicator: {
      position: "absolute",
      top: Spacing.sm,
      right: Spacing.sm,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      justifyContent: "center",
      alignItems: "center",
      ...Shadows.sm,
    },
    favoriteIcon: {
      fontSize: 18,
    },
    infoContainer: {
      padding: Spacing.md,
      backgroundColor: themeColors.background,
    },
    name: {
      fontSize: Typography.sizes.sm,
      fontWeight: "600",
      color: themeColors.text,
      marginBottom: Spacing.xs,
    },
    breed: {
      fontSize: Typography.sizes.xs,
      color: themeColors.tabIconDefault,
    },
  });

const Typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
} as const;

export default CatListItem;
