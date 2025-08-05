import type { ApiRecipe } from "@/src/types/recipe.types";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Card, Text } from "react-native-paper";

type Props = {
  recipe: ApiRecipe;
  onPress: () => void;
};

export const RecipeCard = memo(function RecipeCard({ recipe, onPress }: Props) {
  return (
    <Card style={{ marginBottom: 16, elevation: 2 }} onPress={onPress}>
      <Image
        source={recipe.image}
        style={{ width: "100%", height: 180 }}
        contentFit="cover"
        transition={120}
        cachePolicy="memory-disk"
      />
      <Card.Content style={{ paddingVertical: 8 }}>
        <Text variant="titleLarge">{recipe.name}</Text>
        <Text variant="bodyMedium">
          Prep Time: {recipe.prepTimeMinutes} min
        </Text>
        <Text variant="bodySmall">Difficulty: {recipe.difficulty}</Text>
      </Card.Content>
    </Card>
  );
});
