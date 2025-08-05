// src/api/queries/useSearchRecipes.ts
import { RecipesResponse } from "@/src/types/recipe.types";
import { useQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

export const getRecipesBySearch = async (
  query: string
): Promise<RecipesResponse> => {
  const response = await restClient.get<RecipesResponse>(
    `/recipes/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const searchRecipes = {
  all: ["searchRecipes"] as const,
  byQuery: (query: string) => [...searchRecipes.all, query] as const,
};

export const useSearchRecipes = (query: string) => {
  return useQuery({
    queryKey: searchRecipes.byQuery(query),
    queryFn: () => getRecipesBySearch(query),
    enabled: query.length > 0,
  });
};
