import { RecipeDetail } from "@/src/types/recipe.types";
import { useQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

export const getRecipe = async (id: number): Promise<RecipeDetail> => {
  const response = await restClient.get<RecipeDetail>(`/recipes/${id}`);
  return response.data;
};

export const recipe = {
  all: ["recipe"] as const,
  byId: (id: number) => [...recipe.all, id] as const,
};

export const useGetRecipe = (id: number) => {
  return useQuery({
    queryKey: recipe.byId(id),
    queryFn: () => getRecipe(id),
  });
};
