import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

export const ACTIVITY_COMMENTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "COMMENTS",
];

export const SET_ACTIVITY_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityComments>>
) => {
  client.setQueryData(ACTIVITY_COMMENTS_QUERY_KEY(...keyParams), response);
};

interface GetActivityCommentsProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityComments = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetActivityCommentsProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/comments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetActivityComments = (activityId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityComments>>
  >(
    ACTIVITY_COMMENTS_QUERY_KEY(activityId),
    (params: any) => GetActivityComments(params),
    {
      activityId,
    },
    {
      enabled: !!activityId,
    }
  );
};

export default useGetActivityComments;
