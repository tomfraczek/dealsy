export type ApiRecipe = {
  caloriesPerServing: number;
  cookTimeMinutes: number;
  cuisine: string;
  difficulty: "Easy" | "Medium" | "Hard";
  id: number;
  image: string;
  ingredients: string[];
  instructions: string[];
  mealType: string[];
  name: string;
  prepTimeMinutes: number;
  rating: number;
  reviewCount: number;
  servings: number;
  tags: string[];
  userId: number;
};

export type RecipesResponse = {
  limit: number;
  skip: number;
  total: number;
  recipes: ApiRecipe[];
};

export type RecipeDetail = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};
