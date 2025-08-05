import type { RecipesResponse } from "@/src/types/recipe.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

const PAGE_SIZE = 20;

export const getRecipes = async (): Promise<RecipesResponse> => {
  const response = await restClient.get<RecipesResponse>("/recipes");
  return response.data;
};

const getRecipesPage = async (
  skip: number,
  limit = PAGE_SIZE
): Promise<RecipesResponse> => {
  const { data } = await restClient.get<RecipesResponse>(
    `/recipes?limit=${limit}&skip=${skip}`
  );
  return data;
};

export const recipes = {
  all: ["recipes"] as const,
};

export const useRecipes = () => {
  return useInfiniteQuery({
    queryKey: recipes.all,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getRecipesPage(pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};
