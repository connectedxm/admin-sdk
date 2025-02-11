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
 * Endpoint to retrieve a list of subscribers for a specific channel.
 * This function allows users to fetch subscribers of a channel, with an optional filter by status.
 * It is designed to be used in applications where managing or viewing channel subscribers is required.
 * @name GetChannelSubscribers
 * @param {string} channelId (path) The id of the channel
 * @param {string} [status] (query) Optional status to filter subscribers
 * @version 1.3
 **/

export const CHANNEL_SUBSCRIBERS_QUERY_KEY = (
  channelId: string,
  status?: string
) => {
  const keys = [...CHANNEL_QUERY_KEY(channelId), "SUBSCRIBERS"];
  if (status) keys.push(status);
  return keys;
};

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
