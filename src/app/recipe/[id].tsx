// app/recipe/[id].tsx
import { useGetRecipe } from "@/src/api/queries/useGetRecipe";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Card,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

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
        <Card>
          <Card.Cover source={{ uri: recipe.image }} />
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              {recipe.name}
            </Text>

            <View style={styles.metaRow}>
              <Text variant="bodySmall">
                Prep: {recipe.prepTimeMinutes} min
              </Text>
              <Divider style={styles.dividerVertical} />
              <Text variant="bodySmall">
                Cook: {recipe.cookTimeMinutes} min
              </Text>
              <Divider style={styles.dividerVertical} />
              <Text variant="bodySmall">Difficulty: {recipe.difficulty}</Text>
            </View>

            <Text variant="titleMedium" style={styles.sectionHeader}>
              Ingredients
            </Text>
            {recipe.ingredients.map((ing, i) => (
              <Text key={i} variant="bodyMedium">
                • {ing}
              </Text>
            ))}

            <Text variant="titleMedium" style={styles.sectionHeader}>
              Instructions
            </Text>
            {recipe.instructions.map((step, i) => (
              <Text key={i} variant="bodyMedium">
                {i + 1}. {step}
              </Text>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { marginVertical: 12 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerVertical: {
    width: 1,
    height: "100%",
    marginHorizontal: 8,
    backgroundColor: "#CCC",
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
  },
});
