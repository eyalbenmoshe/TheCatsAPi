import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../constants/theme";

interface HeaderProps {
  title?: string;
  favoritesCount: number;
  rightElement?: React.ReactNode;
  onBadgePress?: () => void;
}

/**
 * Custom header component with app title and favorites count badge
 * Displays on all screens with real-time badge updates
 */
const Header: React.FC<HeaderProps> = ({
  title = "Cat Gallery",
  favoritesCount,
  rightElement,
  onBadgePress,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles(themeColors, insets),
    [themeColors, insets]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={onBadgePress}
          disabled={!onBadgePress}
          activeOpacity={onBadgePress ? 0.6 : 1}
        >
          <View style={styles.badgeContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
            <Text style={styles.badge}>{favoritesCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </View>
  );
};

const createStyles = (themeColors: typeof Colors.light, insets: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors.background,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
      paddingTop: insets.top,
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    content: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: themeColors.text,
    },
    badgeContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: themeColors.border,
      borderRadius: 20,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      marginLeft: Spacing.md,
    },
    heartIcon: {
      fontSize: 16,
      marginRight: Spacing.xs,
    },
    badge: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      color: themeColors.text,
    },
    rightElement: {
      marginLeft: Spacing.md,
    },
  });

export default Header;
