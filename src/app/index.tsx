import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Appbar,
  ActivityIndicator as PaperActivity,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRecipes } from "../api/queries/useGetRecipes";
import { useSearchRecipes } from "../api/queries/useSearchRecipes";
import type { ApiRecipe } from "../types/recipe.types";

import { CollapsibleSearch } from "@/src/components/common/CollapsibleSearch";
import { RecipeCard } from "@/src/components/common/RecipeCard";
import { useLastSearches } from "@/src/hooks/useLastSearches";

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState(false);

  // separate input from executed query
  const [searchInput, setSearchInput] = useState("");
  const [executedQuery, setExecutedQuery] = useState<string | null>(null);

  const {
    items: lastSearches,
    add: addHistory,
    loaded: historyLoaded,
  } = useLastSearches(5);

  // Base list — infinite
  const {
    data: baseData,
    isLoading,
    error,
    fetchNextPage: fetchNextBase,
    hasNextPage: hasNextBase,
    isFetchingNextPage: isFetchingNextBase,
    refetch: refetchBase, // <- for pull-to-refresh
    isRefetching: isRefetchingBase, // <- refetching indicator
  } = useRecipes();

  // Search list — infinite (enabled only after pressing Search)
  const {
    data: searchData,
    isFetching: isSearching,
    fetchNextPage: fetchNextSearch,
    hasNextPage: hasNextSearch,
    isFetchingNextPage: isFetchingNextSearch,
    refetch: refetchSearch, // <- do pull-to-refresh
    isRefetching: isRefetchingSearch, // <- refetching indicator
  } = useSearchRecipes(executedQuery ?? "", { enabled: !!executedQuery });

  const onSearch = async () => {
    const q = searchInput.trim();
    if (!q) return;
    await addHistory(q);
    setExecutedQuery(q);
    await refetchSearch(); // fetch first page of search results
  };

  const onPickHistory = async (q: string) => {
    setSearchInput(q);
    await addHistory(q);
    setExecutedQuery(q);
    await refetchSearch();
  };

  const onClearSearch = () => {
    setSearchInput("");
    setExecutedQuery(null); // back to base list
  };

  // Flatten pages into a single array
  const pages = executedQuery ? searchData?.pages : baseData?.pages;
  const currentRecipes = useMemo<ApiRecipe[]>(
    () => (pages ? pages.flatMap((p) => p.recipes) : []),
    [pages]
  );

  // Infinite scroll controls
  const canLoadMore = executedQuery ? !!hasNextSearch : !!hasNextBase;
  const isFetchingMore = executedQuery
    ? isFetchingNextSearch
    : isFetchingNextBase;

  const handleEndReached = () => {
    if (canLoadMore && !isFetchingMore) {
      if (executedQuery) {
        fetchNextSearch();
      } else {
        fetchNextBase();
      }
    }
  };

  // Pull-to-refresh
  const refreshing = executedQuery ? isRefetchingSearch : isRefetchingBase;
  const onRefresh = () => {
    if (executedQuery) {
      refetchSearch();
    } else {
      refetchBase();
    }
  };

  const shouldShowEmptyState =
    !!executedQuery && !isSearching && currentRecipes.length === 0;

  const listEmptyComponent = React.useMemo(() => {
    if (isSearching) return <PaperActivity animating size="small" />;
    if (shouldShowEmptyState)
      return (
        <Text variant="bodyMedium" style={styles.empty}>
          No results for “{executedQuery}”.
        </Text>
      );
    return null;
  }, [isSearching, shouldShowEmptyState, executedQuery]);

  const listFooter = React.useMemo(() => {
    return isFetchingMore ? (
      <PaperActivity animating style={{ marginVertical: 12 }} />
    ) : null;
  }, [isFetchingMore]);

  if (isLoading || !historyLoaded) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom", "left", "right"]}>
        <PaperActivity animating size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center} edges={["bottom", "left", "right"]}>
        <Text variant="bodyMedium" style={{ color: colors.error }}>
          Failed to load recipes. Please try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <Appbar.Header>
        <Appbar.Content title="Recipes" />
        <Appbar.Action
          icon={expanded ? "chevron-up" : "magnify"}
          onPress={() => setExpanded((v) => !v)}
          accessibilityLabel="Toggle search"
        />
      </Appbar.Header>

      <CollapsibleSearch
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        searchQuery={searchInput}
        setSearchQuery={setSearchInput}
        onSearch={onSearch}
        onClear={onClearSearch}
        isSearching={isSearching}
        lastSearches={lastSearches}
        onPickHistory={onPickHistory}
      />

      <FlashList
        data={currentRecipes}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooter}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 16,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
