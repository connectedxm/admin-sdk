import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "..";
import { produce } from "immer";

export const AppendInfiniteQuery = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  newData: any
) => {
  queryClient.setQueryData(
    key as QueryKey,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>>) => {
      return produce(oldData, (draft) => {
        if (draft?.pages?.[0]?.data) {
          if (
            draft?.pages?.[0]?.data &&
            draft?.pages?.[0]?.data?.length > 0 &&
            newData
          ) {
            draft?.pages?.[0]?.data?.unshift(newData);
          } else {
            draft.pages[0].data = [newData];
          }
        }
      });
    }
  );
};
