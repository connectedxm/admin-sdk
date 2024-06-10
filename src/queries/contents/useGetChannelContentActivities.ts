import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import { GetAdminAPI } from "@src/AdminAPI";

export const CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "ACTIVITIES"];

export const SET_CHANNEL_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentActivities>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentActivitiesProps extends InfiniteQueryParams {
  contentId: string;
}

export const GetContentActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
  adminApiParams,
}: GetContentActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents/${contentId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetContentActivities = (channelId: string, contentId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentActivities>>
  >(
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(channelId, contentId),
    (params: any) => GetContentActivities(params),
    {
      contentId,
    },
    {
      enabled: !!contentId,
    }
  );
};

export default useGetContentActivities;
