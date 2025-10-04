import { ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Activities
 */
export const ACTIVITY_COMMENTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "COMMENTS",
];

/**
 * @category Setters
 * @group Activities
 */
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

/**
 * @category Queries
 * @group Activities
 */
export const GetActivityComments = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
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
/**
 * @category Hooks
 * @group Activities
 */
export const useGetActivityComments = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityComments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityComments>>
  >(
    ACTIVITY_COMMENTS_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityComments({ activityId, ...params }),
    params,
    {
      ...options,
      enabled: !!activityId,
    }
  );
};
