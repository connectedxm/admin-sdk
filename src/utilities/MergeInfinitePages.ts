import { ConnectedXMResponse } from "@interfaces";
import { InfiniteData } from "@tanstack/react-query";

export function MergeInfinitePages<TData>(
  data: InfiniteData<ConnectedXMResponse<TData[]>>
) {
  return data.pages.reduce(
    (sessions: TData[], page: ConnectedXMResponse<TData[]>) => {
      return [...sessions, ...page.data];
    },
    []
  );
}
