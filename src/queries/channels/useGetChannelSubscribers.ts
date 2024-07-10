import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BaseChannelSubscribers, ConnectedXMResponse } from "@src/interfaces";

import { CHANNELS_QUERY_KEY } from "./useGetChannels";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group ChannelSubscribers
 */
export const CHANNEL_SUBSCRIBERS_QUERY_KEY = (channelId: string) => [
  ...CHANNELS_QUERY_KEY(),
  channelId,
];

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

interface GetChannelProps extends SingleQueryParams {
  channelId: string;
}

/**
 * @category Queries
 * @group ChannelSubscribers
 */
export const GetChannelSubscribers = async ({
  channelId,
  adminApiParams,
}: GetChannelProps): Promise<ConnectedXMResponse<BaseChannelSubscribers>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<BaseChannelSubscribers>
  >(`/channels/${channelId}/subscribers`);
  return data;
};

/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelSubscribers = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelSubscribers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelSubscribers>>(
    CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    (params: SingleQueryParams) =>
      GetChannelSubscribers({ channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
