// app/index.tsx
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  Chip,
  ActivityIndicator as PaperActivity,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRecipes } from "../api/queries/useGetRecipes";
import { useSearchRecipes } from "../api/queries/useSearchRecipes";
import type { ApiRecipe } from "../types/recipe.types";

const LAST_SEARCHES_KEY = "lastSearches";

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  // Base list
  const { data, isLoading, error } = useRecipes();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: searchData,
    isFetching: isSearching,
    refetch: doFetchSearch,
  } = useSearchRecipes(searchQuery);

  // History
  const [lastSearches, setLastSearches] = useState<string[]>([]);

  // Collapsible search container (in-flow, no absolute)
  const [expanded, setExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current; // 0=collapsed, 1=expanded
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: false, // animujemy height -> bez native drivera
    }).start();
  }, [expanded]);

  // measure real content height once (or when layout changes)
  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h !== contentHeight) setContentHeight(h);
  };

  const containerHeight = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(contentHeight, 1)], // unikamy 0 -> buga
        extrapolate: "clamp",
      }),
    [anim, contentHeight]
  );

  // Load history
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(LAST_SEARCHES_KEY);
      if (stored) setLastSearches(JSON.parse(stored));
    })();
  }, []);

  const persistHistory = async (q: string) => {
    const next = [q, ...lastSearches.filter((x) => x !== q)].slice(0, 5);
    setLastSearches(next);
    await SecureStore.setItemAsync(LAST_SEARCHES_KEY, JSON.stringify(next));
  };

  const onSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    await persistHistory(q);
    doFetchSearch();
  };

  const useSearchResults = searchQuery.length > 0;
  const recipesToShow = useSearchResults ? searchData?.recipes : data?.recipes;

  const renderItem = ({ item }: { item: ApiRecipe }) => (
    <Card style={styles.card} onPress={() => router.push(`/recipe/${item.id}`)}>
      <Card.Cover source={{ uri: item.image }} />
      <Card.Content style={styles.cardContent}>
        <Text variant="titleLarge">{item.name}</Text>
        <Text variant="bodyMedium">Prep Time: {item.prepTimeMinutes} min</Text>
        <Text variant="bodySmall">Difficulty: {item.difficulty}</Text>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
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

      {/* Collapsible search area sits directly under the header, within safe area */}
      <Animated.View style={[styles.collapse, { height: containerHeight }]}>
        {/* This is the measured content (overflow hidden by parent) */}
        <View onLayout={onContentLayout} style={styles.searchBlock}>
          <Searchbar
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={onSearch}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            returnKeyType="search"
            clearIcon="close"
            onIconPress={onSearch}
          />
          <Button
            mode="contained-tonal"
            icon="magnify"
            onPress={onSearch}
            style={styles.searchButton}
          >
            Search
          </Button>

          {isSearching ? (
            <PaperActivity animating size="small" style={styles.searchLoader} />
          ) : null}

          {lastSearches.length > 0 && (
            <View style={styles.historyContainer}>
              <Text variant="labelLarge" style={styles.historyLabel}>
                Recent searches
              </Text>
              <View style={styles.chipsWrap}>
                {lastSearches.map((q) => (
                  <Chip
                    key={q}
                    icon="history"
                    onPress={() => {
                      setSearchQuery(q);
                      persistHistory(q);
                      doFetchSearch();
                    }}
                    style={styles.chip}
                  >
                    {q}
                  </Chip>
                ))}
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      <FlashList
        data={recipesToShow}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Collapsible wrapper (animated height)
  collapse: {
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  searchBlock: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  searchbar: {
    borderRadius: 12,
  },
  searchInput: {
    // lekko większy tekst, czytelny
  },
  searchButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  searchLoader: {
    marginTop: 8,
  },
  historyContainer: {
    marginTop: 8,
  },
  historyLabel: {
    marginBottom: 6,
    color: "#666",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },

  list: { padding: 16 },

  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
