import { ActivityStatus, ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string,
  status?: keyof typeof ActivityStatus
) => {
  const key = [
    ...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    "ACTIVITIES",
  ];
  if (status) {
    key.push(status);
  }
  return key;
};

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentActivities>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentActivitiesProps extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
  status?: keyof typeof ActivityStatus;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentActivities = async ({
  channelId,
  contentId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetContentActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}/activities`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentActivities = (
  channelId: string = "",
  contentId: string = "",
  status?: keyof typeof ActivityStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentActivities>>
  >(
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(channelId, contentId, status),
    (params: InfiniteQueryParams) =>
      GetChannelContentActivities({
        channelId,
        contentId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options.enabled ?? true),
    },
    "channels"
  );
};
