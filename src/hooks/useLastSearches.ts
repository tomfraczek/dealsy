import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const KEY = "lastSearches";

export function useLastSearches(max = 5) {
  const [items, setItems] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync(KEY);
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch {
          setItems([]);
        }
      }
      setLoaded(true);
    })();
  }, []);

  const persist = useCallback(async (arr: string[]) => {
    setItems(arr);
    await SecureStore.setItemAsync(KEY, JSON.stringify(arr));
  }, []);

  const add = useCallback(
    async (q: string) => {
      const value = q.trim();
      if (!value) return;
      const next = [value, ...items.filter((x) => x !== value)].slice(0, max);
      await persist(next);
    },
    [items, max, persist]
  );

  const remove = useCallback(
    async (q: string) => {
      const next = items.filter((x) => x !== q);
      await persist(next);
    },
    [items, persist]
  );

  const clear = useCallback(async () => {
    await persist([]);
  }, [persist]);

  return { items, loaded, add, remove, clear };
}
