import type { RecipeDetail } from "@/src/types/recipe.types";
import { Image } from "expo-image";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";

type Props = {
  recipe: RecipeDetail;
  imageHeight?: number;
};

export const RecipeDetailCard = memo(function RecipeDetailCard({
  recipe,
  imageHeight = 260,
}: Props) {
  const theme = useTheme();
  const radius = Math.max(12, theme.roundness * 3);

  return (
    <Card style={[styles.card, { borderRadius: radius }]}>
      <View
        style={{
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          overflow: "hidden",
        }}
      >
        <Image
          source={recipe.image}
          style={{ width: "100%", height: imageHeight }}
          contentFit="cover"
          transition={160}
          cachePolicy="memory-disk"
          priority="high"
          recyclingKey={recipe.image}
        />
      </View>

      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {recipe.name}
        </Text>

        <View style={styles.metaRow}>
          <Text variant="bodySmall">Prep: {recipe.prepTimeMinutes} min</Text>
          <Divider style={styles.dividerVertical} />
          <Text variant="bodySmall">Cook: {recipe.cookTimeMinutes} min</Text>
          <Divider style={styles.dividerVertical} />
          <Text variant="bodySmall">Difficulty: {recipe.difficulty}</Text>
        </View>

        <Text variant="titleMedium" style={styles.sectionHeader}>
          Ingredients
        </Text>
        {recipe.ingredients.map((ing, i) => (
          <Text key={i} variant="bodyMedium">
            -{ing}
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
  );
});

const styles = StyleSheet.create({
  card: { marginBottom: 16, elevation: 2 },
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
});
