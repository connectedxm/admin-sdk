import { ActivityStatus, ConnectedXMResponse } from "@src/interfaces";

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
 * @category Keys
 * @group Channels
 */
export const CHANNEL_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  status?: keyof typeof ActivityStatus
) => {
  const key = [...CHANNEL_QUERY_KEY(channelId), "ACTIVITIES"];
  if (status) {
    key.push(status);
  }
  return key;
};

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelActivities>>
) => {
  client.setQueryData(CHANNEL_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetChannelActivitiesProps extends InfiniteQueryParams {
  channelId: string;
  status?: keyof typeof ActivityStatus;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelActivities = async ({
  channelId: channelId,
  status,
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
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelActivities = (
  channelId: string = "",
  status?: keyof typeof ActivityStatus,
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
    CHANNEL_ACTIVITIES_QUERY_KEY(channelId, status),
    (params: InfiniteQueryParams) =>
      GetChannelActivities({
        channelId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && (options.enabled ?? true),
    }
  );
};
