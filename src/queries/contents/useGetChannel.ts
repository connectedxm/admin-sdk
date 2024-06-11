import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";

import { Channel } from "@src/interfaces";
import { CHANNELS_QUERY_KEY } from "./useGetChannels";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Contents
 */
export const CHANNEL_QUERY_KEY = (channelId: string) => [
  ...CHANNELS_QUERY_KEY(),
  channelId,
];

/**
 * @category Setters
 * @group Contents
 */
export const SET_CHANNEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannel>>
) => {
  client.setQueryData(CHANNEL_QUERY_KEY(...keyParams), response);
};

interface GetChannelProps extends SingleQueryParams {
  channelId: string;
}

/**
 * @category Queries
 * @group Contents
 */
export const GetChannel = async ({
  channelId,
  adminApiParams,
}: GetChannelProps): Promise<ConnectedXMResponse<Channel>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}`);
  return data;
};
/**
 * @category Hooks
 * @group Contents
 */
export const useGetChannel = (
  channelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannel>>(
    CHANNEL_QUERY_KEY(channelId),
    (params: SingleQueryParams) => GetChannel({ channelId, ...params }),
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
