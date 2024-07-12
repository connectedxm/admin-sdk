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
 * @category Keys
 * @group Channels
 */
export const CHANNEL_SUBSCRIBER_QUERY_KEY = (
  channelId: string,
  accountId: string
) => [...CHANNELS_QUERY_KEY(), channelId, accountId];

/**
 * @category Setters
 * @group Channels
 */
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

/**
 * @category Queries
 * @group Channels
 */
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
/**
 * @category Hooks
 * @group Channels
 */
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
    }
  );
};
