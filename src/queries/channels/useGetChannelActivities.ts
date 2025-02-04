import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";

/**
 * Endpoint to retrieve activities within a specific channel.
 * This function fetches a list of activities associated with a given channel ID, 
 * allowing users to view and manage channel-specific activities.
 * It is designed for applications that require detailed activity logs for channels.
 * @name GetChannelActivities
 * @param {string} channelId - The id of the channel
 * @version 1.2
 **/

export const CHANNEL_ACTIVITIES_QUERY_KEY = (channelId: string) => [
  ...CHANNEL_QUERY_KEY(channelId),
  "ACTIVITIES",
];

export const SET_CHANNEL_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelActivities>>
) => {
  client.setQueryData(CHANNEL_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetChannelActivitiesProps extends InfiniteQueryParams {
  channelId: string;
}

export const GetChannelActivities = async ({
  channelId: channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetChannelActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetChannelActivities = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelActivities>>
  >(
    CHANNEL_ACTIVITIES_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetChannelActivities({
        channelId: groupId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "channels"
  );
};