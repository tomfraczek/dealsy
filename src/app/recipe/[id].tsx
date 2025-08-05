import { useGetRecipe } from "@/src/api/queries/useGetRecipe";
import { RecipeDetailCard } from "@/src/components/common/RecipeDetailCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

export default function RecipeDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipeId = Number(id);
  const { data: recipe, isLoading, error } = useGetRecipe(recipeId);
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator animating size="large" />
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView style={styles.center}>
        <Text variant="bodyMedium" style={{ color: colors.error }}>
          Unable to load recipe.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <RecipeDetailCard recipe={recipe} imageHeight={260} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
