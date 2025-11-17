import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CatListItem,
  ErrorMessage,
  Header,
  LoadingSpinner,
} from "../components";
import { Colors, Spacing } from "../constants/theme";
import { useCats } from "../hooks/useCats";
import { useAppSelector } from "../store/store";
import { Cat } from "../types";

export default function CatListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const themeColors = isDark ? Colors.dark : Colors.light;

  // Redux state - favorite IDs
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const favoritesCount = favoriteIds.length;

  // Pagination and cat data
  const { cats, isLoading, error, hasMore, loadMore } = useCats();

  const styles = useMemo(() => createStyles(themeColors), [themeColors]);

  /**
   * Handle load more when reaching end of list
   */
  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  /**
   * Handle cat item press - navigate to detail screen
   */
  const handleCatPress = useCallback(
    (cat: Cat) => {
      router.push(`/${cat.id}`);
    },
    [router]
  );

  /**
   * Handle retry on error
   */
  const handleRetry = useCallback(() => {
    loadMore();
  }, [loadMore]);

  /**
   * Render individual cat list item with favorite status
   */
  const renderCatItem = useCallback(
    ({ item }: { item: Cat }) => {
      const isFavorite = favoriteIds.includes(item.id);
      return (
        <CatListItem
          cat={item}
          isFavorite={isFavorite}
          onPress={() => handleCatPress(item)}
        />
      );
    },
    [favoriteIds, handleCatPress]
  );

  /**
   * Render header with favorites count
   */
  const renderHeader = useMemo(
    () => <Header title="Cat Gallery" favoritesCount={favoritesCount} />,
    [favoritesCount]
  );

  // Show loading on first load
  if (isLoading && cats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader}
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  // Show error if fetch failed and no cached data
  if (error && cats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader}
        <ErrorMessage
          message="Failed to load cats. Please check your connection and try again."
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader}
      <FlatList
        data={cats}
        renderItem={renderCatItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        ListFooterComponent={isLoading ? <LoadingSpinner /> : null}
      />
    </SafeAreaView>
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
  });
