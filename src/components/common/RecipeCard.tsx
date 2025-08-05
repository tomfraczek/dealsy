import type { ApiRecipe } from "@/src/types/recipe.types";
import React from "react";
import { Card, Text } from "react-native-paper";

type Props = {
  recipe: ApiRecipe;
  onPress: () => void;
};

export const RecipeCard = ({ recipe, onPress }: Props) => {
  return (
    <Card style={{ marginBottom: 16, elevation: 2 }} onPress={onPress}>
      <Card.Cover source={{ uri: recipe.image }} />
      <Card.Content style={{ paddingVertical: 8 }}>
        <Text variant="titleLarge">{recipe.name}</Text>
        <Text variant="bodyMedium">
          Prep Time: {recipe.prepTimeMinutes} min
        </Text>
        <Text variant="bodySmall">Difficulty: {recipe.difficulty}</Text>
      </Card.Content>
    </Card>
  );
};
