import { GetAdminAPI } from "@src/AdminAPI";
import { BaseChannelSubscriber, ConnectedXMResponse } from "@src/interfaces";

import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_SUBSCRIBERS_QUERY_KEY = (
  channelId: string,
  status?: string
) => {
  const keys = [...CHANNEL_QUERY_KEY(channelId), "SUBSCRIBERS"];
  if (status) keys.push(status);
  return keys;
};

/**
 * @category Setters
 * @group ChannelSubscribers
 */
export const SET_CHANNEL_SUBSCRIBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_SUBSCRIBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelSubscribers>>
) => {
  client.setQueryData(CHANNEL_SUBSCRIBERS_QUERY_KEY(...keyParams), response);
};

interface GetChannelSubscribersProps extends InfiniteQueryParams {
  channelId: string;
  status?: string;
}

/**
 * @category Queries
 * @group ChannelSubscribers
 */
export const GetChannelSubscribers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  status,
  adminApiParams,
}: GetChannelSubscribersProps): Promise<
  ConnectedXMResponse<BaseChannelSubscriber[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/subscribers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group ChannelSubscribers
 */
export const useGetChannelSubscribers = (
  channelId: string = "",
  status?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelSubscribers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelSubscribers>>
  >(
    CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId, status),
    (params: InfiniteQueryParams) =>
      GetChannelSubscribers({
        channelId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && (options.enabled ?? true),
    },
    "channels"
  );
};
