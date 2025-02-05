import { ConnectedXMResponse } from "@src/interfaces";
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
 * Fetches activities related to specific channel content, with support for pagination and filtering.
 * This function is designed to retrieve a list of activities associated with a given channel and content ID.
 * It is useful for applications that need to display or process activity logs or records for specific content.
 * @name GetChannelContentActivities
 * @param {string} channelId - The id of the channel
 * @param {string} contentId - The id of the content
 * @version 1.2
 **/

export const CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "ACTIVITIES"];

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
}

export const GetChannelContentActivities = async ({
  channelId,
  contentId,
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
      },
    }
  );
  return data;
};

export const useGetChannelContentActivities = (
  channelId: string = "",
  contentId: string = "",
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
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentActivities({
        channelId,
        contentId,
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