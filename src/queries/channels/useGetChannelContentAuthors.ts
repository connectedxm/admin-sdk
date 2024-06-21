import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_AUTHORS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "AUTHORS"];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_AUTHORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_AUTHORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentAuthors>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_AUTHORS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentAuthorsProps extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
  status?: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentAuthors = async ({
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetChannelContentAuthorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/authors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentAuthors = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentAuthors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentAuthors>>
  >(
    CHANNEL_CONTENT_AUTHORS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentAuthors({
        channelId,
        contentId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options.enabled ?? true),
    }
  );
};
