import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";
import { Cat } from "../types";

interface CatCardProps {
  cat: Cat;
}

/**
 * Component displaying comprehensive cat details including image, breed info, temperament, and description
 * Scrollable to handle long descriptions
 */
const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  const styles = useMemo(() => createStyles(themeColors), [themeColors]);

  // Get primary breed or fallback
  const breed = cat.breeds?.[0];
  const breedName = breed?.name || "Unknown Breed";
  const temperament = breed?.temperament || "Not specified";
  const description = breed?.description || "No description available";
  const origin = breed?.origin || "Unknown";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Cat Image */}
      <Image
        source={{ uri: cat.url }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Breed Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.breedName}>{breedName}</Text>

        {/* Origin */}
        {origin !== "Unknown" && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Origin:</Text>
            <Text style={styles.value}>{origin}</Text>
          </View>
        )}

        {/* Temperament */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperament</Text>
          <Text style={styles.temperament}>{temperament}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Cat ID */}
        <View style={styles.idContainer}>
          <Text style={styles.idText}>ID: {cat.id}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (themeColors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    image: {
      width: "100%",
      height: 300,
      backgroundColor: themeColors.border,
    },
    contentContainer: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    breedName: {
      fontSize: Typography.sizes.xxl,
      fontWeight: Typography.weights.bold,
      color: themeColors.text,
      marginBottom: Spacing.md,
    },
    infoRow: {
      flexDirection: "row",
      marginBottom: Spacing.md,
      alignItems: "flex-start",
    },
    label: {
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
      color: themeColors.text,
      marginRight: Spacing.sm,
      minWidth: 70,
    },
    value: {
      fontSize: Typography.sizes.md,
      color: themeColors.tabIconDefault,
      flex: 1,
    },
    section: {
      marginVertical: Spacing.md,
    },
    sectionTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.semibold,
      color: themeColors.text,
      marginBottom: Spacing.sm,
    },
    temperament: {
      fontSize: Typography.sizes.md,
      color: themeColors.tabIconDefault,
      lineHeight: 22,
    },
    description: {
      fontSize: Typography.sizes.md,
      color: themeColors.tabIconDefault,
      lineHeight: 24,
    },
    idContainer: {
      marginTop: Spacing.xl,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
    },
    idText: {
      fontSize: Typography.sizes.xs,
      color: themeColors.tabIconDefault,
    },
  });

export default CatCard;
