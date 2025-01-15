import { ConnectedXMResponse } from "@src/interfaces";
import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { Draft, produce } from "immer";

/**
 * Updates a single item in the infinite data pages by finding
 * it via a custom `predicate`.
 *
 * @param queryClient - Instance of QueryClient
 * @param key - The React Query key for the infinite query
 * @param updatedItem - The data you want to set or merge
 * @param predicate - A function that returns true when it finds the matching item
 */
export function UpdateInfiniteQueryItem<TData>(
  queryClient: QueryClient,
  key: QueryKey,
  updatedItem: TData,
  predicate: (item: Draft<TData>) => boolean
) {
  queryClient.setQueryData<InfiniteData<ConnectedXMResponse<TData[]>>>(
    key,
    (oldData) => {
      if (!oldData) return oldData;

      return produce(oldData, (draft) => {
        for (const page of draft.pages) {
          if (!page) continue;

          const index = page.data.findIndex(predicate);
          if (index !== -1) {
            // Merge the fields from updatedItem into the existing item.
            page.data[index] = {
              ...page.data[index],
              ...(updatedItem as Draft<TData>),
            };
            break; // We only update the first match.
          }
        }
      });
    }
  );
}
