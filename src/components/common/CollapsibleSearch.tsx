// src/components/CollapsibleSearch.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Button, Chip, Searchbar, Text } from "react-native-paper";

type Props = {
  expanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching: boolean;
  lastSearches: string[];
  onPickHistory: (q: string) => void;
};

export const CollapsibleSearch: React.FC<Props> = ({
  expanded,
  onToggle,
  searchQuery,
  setSearchQuery,
  onSearch,
  onClear,
  isSearching,
  lastSearches,
  onPickHistory,
}) => {
  const anim = useRef(new Animated.Value(0)).current; // 0 collapsed, 1 expanded
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: false, // animujemy height
    }).start();
  }, [expanded, anim]);

  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h !== contentHeight) setContentHeight(h);
  };

  const containerHeight = useMemo(
    () =>
      anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(contentHeight, 1)],
        extrapolate: "clamp",
      }),
    [anim, contentHeight]
  );

  return (
    <Animated.View style={[styles.collapse, { height: containerHeight }]}>
      <View onLayout={onContentLayout} style={styles.block}>
        <Searchbar
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClearIconPress={onClear}
          style={styles.searchbar}
          returnKeyType="search"
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
          <Text variant="bodySmall" style={styles.searchingText}>
            Searching…
          </Text>
        ) : null}

        {lastSearches.length > 0 && (
          <View style={styles.history}>
            <Text variant="labelLarge" style={styles.historyLabel}>
              Recent searches
            </Text>
            <View style={styles.chipsWrap}>
              {lastSearches.map((search) => (
                <Chip
                  key={search}
                  icon="history"
                  onPress={() => onPickHistory(search)}
                  style={styles.chip}
                >
                  {search}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  collapse: {
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  block: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  searchbar: {
    borderRadius: 12,
  },
  searchButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  searchingText: {
    marginTop: 8,
    color: "#666",
  },
  history: {
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
    marginBottom: 8,
  },
});
