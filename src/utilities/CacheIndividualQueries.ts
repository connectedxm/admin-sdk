import { ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";

interface ItemWithId {
  id: string;
  alternateId?: number;
  slug?: string;
  username?: string;
  name?: string | null;
  code?: string;
}

export const CacheIndividualQueries = <TData extends ItemWithId>(
  page: ConnectedXMResponse<TData[]>,
  queryClient: QueryClient,
  queryKeyFn: (id: string) => QueryKey,
  itemMap?: (item: TData) => TData
) => {
  page.data.forEach((item) => {
    item = itemMap ? itemMap(item) : item;

    if (item.id) {
      const SudoResponse: ConnectedXMResponse<TData> = {
        status: page.status,
        message: `Cached From: ${page.message}`,
        data: item,
      };

      // Query Client, keyparams, response
      queryClient.setQueryData([...queryKeyFn(item.id)], SudoResponse, {
        updatedAt: Date.now() - 1000 * 60,
      });

      if (item.slug) {
        queryClient.setQueryData([...queryKeyFn(item.slug)], SudoResponse, {
          updatedAt: Date.now() - 1000 * 60,
        });
      }
      if (item.username) {
        queryClient.setQueryData([...queryKeyFn(item.username)], SudoResponse, {
          updatedAt: Date.now() - 1000 * 60,
        });
      }
      if (item.code) {
        queryClient.setQueryData([...queryKeyFn(item.code)], SudoResponse, {
          updatedAt: Date.now() - 1000 * 60,
        });
      }
      if (item.name) {
        queryClient.setQueryData([...queryKeyFn(item.name)], SudoResponse, {
          updatedAt: Date.now() - 1000 * 60,
        });
      }
      if (item.alternateId) {
        queryClient.setQueryData(
          [...queryKeyFn(item.alternateId.toString())],
          SudoResponse,
          {
            updatedAt: Date.now() - 1000 * 60,
          }
        );
      }
    }
  });
};
