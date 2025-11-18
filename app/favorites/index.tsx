import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CatListItem, Header, LoadingSpinner } from "../../components";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { useCatDetail } from "../../hooks/useCatDetail";
import { clearFavorites } from "../../store/slices/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Cat } from "../../types";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  // Redux state - favorite IDs
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const favoritesCount = favoriteIds.length;

  const styles = useMemo(() => createStyles(themeColors), [themeColors]);

  /**
   * Handle cat item press - navigate to detail screen
   */
  const handleCatPress = useCallback(
    (cat: Cat) => {
      router.push(`/catDetails/${cat.id}`);
    },
    [router]
  );

  /**
   * Handle clear all favorites with confirmation
   */
  const handleClearAllFavorites = useCallback(() => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all favorited cats?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Remove All",
          onPress: () => {
            dispatch(clearFavorites());
          },
          style: "destructive",
        },
      ]
    );
  }, [dispatch]);

  /**
   * Render individual cat list item
   */
  const renderCatItem = useCallback(
    ({ item }: { item: Cat }) => {
      return (
        <CatListItem
          cat={item}
          isFavorite={true}
          onPress={() => handleCatPress(item)}
        />
      );
    },
    [handleCatPress]
  );

  /**
   * Render header with back button and clear all button
   */
  const renderHeader = useMemo(
    () => (
      <Header
        title="My Favorites"
        favoritesCount={favoritesCount}
        rightElement={
          favoritesCount > 0 && (
            <TouchableOpacity
              onPress={handleClearAllFavorites}
              style={styles.clearButton}
              activeOpacity={0.6}
            >
              <Text style={styles.clearButtonText}>🗑️</Text>
            </TouchableOpacity>
          )
        }
      />
    ),
    [favoritesCount, handleClearAllFavorites, styles]
  );

  /**
   * Render empty state when no favorites
   */
  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>😿</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyDescription}>
          Add some cats to your favorites to see them here
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.goBackButton}
        >
          <Text style={styles.goBackButtonText}>Browse Cats</Text>
        </TouchableOpacity>
      </View>
    ),
    [router, styles]
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader}
      {favoriteIds.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={favoriteIds}
          renderItem={({ item: catId }) => (
            <FavoriteCatItem catId={catId} onPress={handleCatPress} />
          )}
          keyExtractor={(item) => item}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

/**
 * Helper component to render each favorite cat
 */
function FavoriteCatItem({
  catId,
  onPress,
}: {
  catId: string;
  onPress: (cat: Cat) => void;
}) {
  const { cat, isLoading } = useCatDetail(catId);

  if (isLoading || !cat) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <CatListItem cat={cat} isFavorite={true} onPress={() => onPress(cat)} />
  );
}

const createStyles = (themeColors: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    listContent: {
      padding: Spacing.sm,
      paddingBottom: Spacing.xl,
    },
    columnWrapper: {
      justifyContent: "space-between",
    },
    clearButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20,
      backgroundColor: themeColors.border,
    },
    clearButtonText: {
      fontSize: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: Spacing.lg,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      fontSize: Typography.sizes.lg,
      fontWeight: Typography.weights.bold,
      color: themeColors.text,
      marginBottom: Spacing.sm,
      textAlign: "center",
    },
    emptyDescription: {
      fontSize: Typography.sizes.md,
      color: themeColors.tabIconDefault,
      textAlign: "center",
      marginBottom: Spacing.xl,
    },
    goBackButton: {
      backgroundColor: themeColors.tint,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderRadius: 8,
    },
    goBackButtonText: {
      color: "#fff",
      fontSize: Typography.sizes.md,
      fontWeight: Typography.weights.semibold,
    },
  });
