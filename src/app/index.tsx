// app/index.tsx
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Appbar,
  Card,
  ActivityIndicator as PaperActivity,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecipes } from "../api/queries/useGetRecipes";
import type { ApiRecipe } from "../types/recipe.types";

export default function Index() {
  const router = useRouter();
  const { data, isLoading, error } = useRecipes();
  const { colors } = useTheme();

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
      <View style={styles.headerContainer}>
        <Appbar.Header>
          <Appbar.Content title="Recipes" />
        </Appbar.Header>
        <Text variant="bodyMedium" style={styles.headerDescription}>
          Explore our curated collection of delicious recipes—find inspiration
          for every meal!
        </Text>
      </View>

      <FlashList
        data={data?.recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={150}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: {},
  headerDescription: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#666",
    textAlign: "center",
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
