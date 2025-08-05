import { RecipeCard } from "@/src/components/common/RecipeCard";
import type { ApiRecipe } from "@/src/types/recipe.types";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

const makeRecipe = (): ApiRecipe =>
  ({
    id: 1,
    name: "Classic Margherita Pizza",
    image: "https://cdn.dummyjson.com/recipe-images/1.webp",
    prepTimeMinutes: 20,
    difficulty: "Easy",
    cookTimeMinutes: 15,
    caloriesPerServing: 300,
    cuisine: "Italian",
    rating: 4.6,
    reviewCount: 3,
    servings: 4,
    tags: ["Pizza", "Italian"],
    userId: 45,
    ingredients: ["Dough", "Tomato", "Mozzarella"],
    instructions: ["Step 1", "Step 2"],
    mealType: ["Dinner"],
  } as ApiRecipe);

describe("<RecipeCard />", () => {
  test("renders title and basic meta", () => {
    const recipe = makeRecipe();
    render(<RecipeCard recipe={recipe} onPress={() => {}} />);

    // Title
    expect(screen.getByText(recipe.name)).toBeTruthy();

    // Meta lines
    expect(
      screen.getByText(`Prep Time: ${recipe.prepTimeMinutes} min`)
    ).toBeTruthy();
    expect(screen.getByText(`Difficulty: ${recipe.difficulty}`)).toBeTruthy();
  });

  test("calls onPress when card is pressed", () => {
    const recipe = makeRecipe();
    const onPress = jest.fn();

    const { getByTestId } = render(
      <RecipeCard recipe={recipe} onPress={onPress} />
    );
    fireEvent.press(getByTestId("card"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
