import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENT_QUERY_KEY } from "./useGetContentTypeContent";

export const CONTENT_TYPE_CONTENT_ACTIVITIES_QUERY_KEY = (
  contentTypeId: string,
  contentId: string
) => [
  ...CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId),
  "ACTIVITIES",
];

export const SET_CONTENT_TYPE_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentActivities>>
) => {
  client.setQueryData(
    CONTENT_TYPE_CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
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

const useGetContentActivities = (contentTypeId: string, contentId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentActivities>>
  >(
    CONTENT_TYPE_CONTENT_ACTIVITIES_QUERY_KEY(contentTypeId, contentId),
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
