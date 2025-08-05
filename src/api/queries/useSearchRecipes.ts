// src/api/queries/useSearchRecipes.ts
import type { RecipesResponse } from "@/src/types/recipe.types";
import { useQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

// Query key factory
export const searchRecipesKeys = {
  all: ["recipes", "search"] as const,
  list: (query: string) => [...searchRecipesKeys.all, query] as const,
};

export const getRecipesBySearch = async (
  query: string
): Promise<RecipesResponse> => {
  const response = await restClient.get<RecipesResponse>(
    `/recipes/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

// Accept options to control 'enabled'
export const useSearchRecipes = (
  query: string,
  opts?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: searchRecipesKeys.list(query),
    queryFn: () => getRecipesBySearch(query),
    enabled: opts?.enabled ?? false, // default: fetch only when refetch() is called
  });
};
