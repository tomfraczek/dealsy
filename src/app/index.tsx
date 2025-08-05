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

  const { data, isLoading, error } = useRecipes();

  const [expanded, setExpanded] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [executedQuery, setExecutedQuery] = useState<string | null>(null);

  const {
    items: lastSearches,
    add: addHistory,
    loaded: historyLoaded,
  } = useLastSearches(5);

  const {
    data: searchData,
    isFetching: isSearching,
    refetch: refetchSearch,
  } = useSearchRecipes(executedQuery ?? "", { enabled: !!executedQuery });

  const onSearch = async () => {
    const q = searchInput.trim();
    if (!q) return;
    await addHistory(q);
    setExecutedQuery(q);
    await refetchSearch();
  };

  const onPickHistory = async (q: string) => {
    setSearchInput(q);
    await addHistory(q);
    setExecutedQuery(q);
    await refetchSearch();
  };

  const onClearSearch = () => {
    setSearchInput("");
    setExecutedQuery(null);
  };

  const recipesToShow = useMemo<ApiRecipe[] | undefined>(() => {
    if (executedQuery) return searchData?.recipes;
    return data?.recipes;
  }, [executedQuery, searchData?.recipes, data?.recipes]);

  const currentRecipes = recipesToShow ?? [];
  const shouldShowEmptyState =
    executedQuery && !isSearching && currentRecipes.length === 0;

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
        ListEmptyComponent={
          isSearching ? (
            <PaperActivity animating size="small" />
          ) : shouldShowEmptyState ? (
            <Text variant="bodyMedium" style={styles.empty}>
              No results for “{executedQuery}”.
            </Text>
          ) : null
        }
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
