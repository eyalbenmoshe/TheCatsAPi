import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CatCard,
  ErrorMessage,
  FavoriteButton,
  Header,
  LoadingSpinner,
} from "../components";
import { Colors, Spacing } from "../constants/theme";
import { useCatDetail } from "../hooks/useCatDetail";
import { useFavorites } from "../hooks/useFavorites";
import { useAppSelector } from "../store/store";

/**
 * Cat Detail Screen - Shows comprehensive information about a single cat
 * Dynamically routed with cat ID parameter
 */
export default function CatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  // Redux state for favorites count
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const favoritesCount = favoriteIds.length;

  // Fetch cat details
  const { cat, isLoading, error, refetch } = useCatDetail(id as string);

  // Favorites management
  const { isFavorite, toggleFavorite } = useFavorites(id as string);

  const styles = useMemo(() => createStyles(themeColors), [themeColors]);

  /**
   * Handle back button press
   */
  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Render header with back button, favorite button, and count badge
   */
  const renderHeader = useMemo(
    () => (
      <Header
        title="Cat Details"
        favoritesCount={favoritesCount}
        rightElement={
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <View>
              <View style={styles.backButtonLine} />
              <View style={styles.backButtonLine} />
            </View>
          </TouchableOpacity>
        }
      />
    ),
    [favoritesCount, handleBackPress, styles]
  );

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader}
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !cat) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader}
        <ErrorMessage
          message={error || "Cat not found"}
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader}
      <View style={styles.contentWrapper}>
        <CatCard cat={cat} />
        {/* Floating favorite button at bottom */}
        <View style={styles.floatingButtonContainer}>
          <FavoriteButton isFavorite={isFavorite} onToggle={toggleFavorite} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (themeColors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    contentWrapper: {
      flex: 1,
      position: "relative",
    },
    floatingButtonContainer: {
      position: "absolute",
      bottom: Spacing.lg,
      right: Spacing.lg,
      zIndex: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Spacing.sm,
    },
    backButtonLine: {
      width: 6,
      height: 2,
      backgroundColor: themeColors.text,
      marginVertical: 3,
      transform: [{ rotate: "-45deg" }],
    },
  });
