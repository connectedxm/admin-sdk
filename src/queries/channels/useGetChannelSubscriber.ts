import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { BaseChannelSubscriber, ConnectedXMResponse } from "@src/interfaces";
import { CHANNELS_QUERY_KEY } from "./useGetChannels";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches data for a specific channel subscriber by channel and account ID.
 * This function is used to retrieve detailed information about a subscriber of a particular channel.
 * It is designed for applications that need to access subscriber data within a channel context.
 * @name GetChannelSubscriber
 * @param {string} channelId - The ID of the channel
 * @param {string} accountId - The ID of the account
 * @version 1.2
 **/

export const CHANNEL_SUBSCRIBER_QUERY_KEY = (
  channelId: string,
  accountId: string
) => [...CHANNELS_QUERY_KEY(), channelId, accountId];

export const SET_CHANNEL_SUBSCRIBER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_SUBSCRIBER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelSubscriber>>
) => {
  client.setQueryData(CHANNEL_SUBSCRIBER_QUERY_KEY(...keyParams), response);
};

interface GetChannelSubscriberProps extends SingleQueryParams {
  channelId: string;
  accountId: string;
}

export const GetChannelSubscriber = async ({
  channelId,
  accountId,
  adminApiParams,
}: GetChannelSubscriberProps): Promise<
  ConnectedXMResponse<BaseChannelSubscriber>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/subscribers/${accountId}`
  );
  return data;
};

export const useGetChannelSubscriber = (
  channelId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelSubscriber>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelSubscriber>>(
    CHANNEL_SUBSCRIBER_QUERY_KEY(channelId, accountId),
    (params: SingleQueryParams) =>
      GetChannelSubscriber({ channelId, accountId, ...params }),
    {
      ...options,
      enabled: !!channelId && !!accountId && (options?.enabled ?? true),
    },
    "channels"
  );
};