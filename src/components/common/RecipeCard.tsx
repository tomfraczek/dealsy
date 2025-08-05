import type { ApiRecipe } from "@/src/types/recipe.types";
import { Image } from "expo-image";
import React from "react";
import { Card, Text } from "react-native-paper";

type Props = { recipe: ApiRecipe; onPress: () => void };

// przykładowy uniwersalny blurhash (lepiej mieć własny per-obraz)
const PLACEHOLDER_BLURHASH = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export const RecipeCard = React.memo(function RecipeCard({
  recipe,
  onPress,
}: Props) {
  return (
    <Card style={{ marginBottom: 16, elevation: 2 }} onPress={onPress}>
      {/* Zamiast Card.Cover używamy expo-image */}
      <Image
        source={recipe.image}
        style={{ width: "100%", height: 180 }} // stała wysokość -> zero skoków
        contentFit="cover"
        placeholder={PLACEHOLDER_BLURHASH}
        transition={120} // lekkie wygładzenie
        cachePolicy="memory-disk" // mocne cache
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
