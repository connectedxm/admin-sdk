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
 * Endpoint to fetch comments associated with a specific activity.
 * This function retrieves a list of comments for a given activity, allowing users to view discussions or feedback related to that activity.
 * It is designed to be used in applications where activity-related comments need to be displayed or managed.
 * @name GetActivityComments
 * @param {string} activityId - The id of the activity
 * @version 1.2
 **/

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
    },
    "activities"
  );
};