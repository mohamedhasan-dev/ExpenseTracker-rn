import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const DAY = 24 * 60 * 60 * 1000;

/** How long saved data may be reused after an app restart before it's discarded */
export const CACHE_MAX_AGE = 7 * DAY;

/** Bump this when the shape of cached API data changes; old caches are thrown away */
export const CACHE_BUSTER = "1";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Must be >= CACHE_MAX_AGE, otherwise restored data is garbage-collected
      gcTime: CACHE_MAX_AGE,
      retry: 2,
    },
  },
});

/** Saves the query cache to AsyncStorage so it survives restarts and works offline */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "expense-tracker-query-cache",
  throttleTime: 1000,
});

/** Wipes the cache in memory and on disk (logout / switching accounts) */
export async function clearQueryCache() {
  queryClient.clear();
  await queryPersister.removeClient();
}
