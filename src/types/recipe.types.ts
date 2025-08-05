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
