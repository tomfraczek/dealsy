import { RecipesResponse } from "@/src/types/recipe.types";
import { useQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

export const getRecipes = async (): Promise<RecipesResponse> => {
  const response = await restClient.get<RecipesResponse>("/recipes");
  return response.data;
};

export const useRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: getRecipes,
  });
};
