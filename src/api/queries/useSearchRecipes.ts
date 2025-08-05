// src/api/queries/useSearchRecipes.ts
import type { RecipesResponse } from "@/src/types/recipe.types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { restClient } from "../axios";

const PAGE_SIZE = 20;

export const searchRecipesKeys = {
  all: ["search"] as const,
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

export const useSearchRecipes = (
  query: string,
  opts?: { enabled?: boolean }
) => {
  const enabled = opts?.enabled ?? false;

  const getSearchPage = async (
    skip: number,
    limit = PAGE_SIZE
  ): Promise<RecipesResponse> => {
    const { data } = await restClient.get<RecipesResponse>(
      `/recipes/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}&skip=${skip}`
    );
    return data;
  };

  return useInfiniteQuery({
    queryKey: searchRecipesKeys.list(query),
    enabled,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getSearchPage(pageParam),
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });
};
