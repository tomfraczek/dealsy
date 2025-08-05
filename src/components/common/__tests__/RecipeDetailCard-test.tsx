import { RecipeDetailCard } from "@/src/components/common/RecipeDetailCard";
import type { RecipeDetail } from "@/src/types/recipe.types";
import { render, screen, waitFor } from "@testing-library/react-native";
import { Image as ExpoImage } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

const makeRecipe = (): RecipeDetail => ({
  id: 1,
  name: "Classic Margherita Pizza",
  ingredients: ["Dough", "Tomato", "Mozzarella"],
  instructions: ["Preheat", "Roll out", "Top and bake"],
  prepTimeMinutes: 20,
  cookTimeMinutes: 15,
  servings: 4,
  difficulty: "Easy",
  cuisine: "Italian",
  caloriesPerServing: 300,
  tags: ["Pizza", "Italian"],
  userId: 45,
  image: "https://cdn.dummyjson.com/recipe-images/1.webp",
  rating: 4.6,
  reviewCount: 3,
  mealType: ["Dinner"],
});

describe("<RecipeDetailCard />", () => {
  test("renders title, meta, ingredients and instructions", async () => {
    const r = makeRecipe();
    render(<RecipeDetailCard recipe={r} />);

    await waitFor(() => {
      expect(screen.getByText(r.name)).toBeTruthy();
    });

    expect(screen.getByText("Prep: 20 min")).toBeTruthy();
    expect(screen.getByText("Cook: 15 min")).toBeTruthy();
    expect(screen.getByText("Difficulty: Easy")).toBeTruthy();
    expect(screen.getByText("Ingredients")).toBeTruthy();
    expect(screen.getByText("-Dough")).toBeTruthy();
    expect(screen.getByText("-Tomato")).toBeTruthy();
    expect(screen.getByText("-Mozzarella")).toBeTruthy();
    expect(screen.getByText("Instructions")).toBeTruthy();
    expect(screen.getByText("1. Preheat")).toBeTruthy();
    expect(screen.getByText("2. Roll out")).toBeTruthy();
    expect(screen.getByText("3. Top and bake")).toBeTruthy();
  });

  test("uses default image height and respects imageHeight prop", async () => {
    const r = makeRecipe();
    const { UNSAFE_getByType, rerender } = render(
      <RecipeDetailCard recipe={r} />
    );

    await waitFor(() => {
      const img1 = UNSAFE_getByType(ExpoImage);
      expect(StyleSheet.flatten(img1.props.style)?.height).toBe(260);
    });

    rerender(<RecipeDetailCard recipe={r} imageHeight={180} />);

    await waitFor(() => {
      const img2 = UNSAFE_getByType(ExpoImage);
      expect(StyleSheet.flatten(img2.props.style)?.height).toBe(180);
    });
  });
});
