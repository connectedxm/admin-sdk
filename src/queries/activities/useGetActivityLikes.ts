import { ConnectedXMResponse } from "@src/interfaces";
import { Like } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of likes for a specific activity.
 * This function fetches likes associated with a given activity ID, allowing users to view who has liked a particular activity.
 * It is designed for applications that require displaying or processing likes data for activities.
 * @name GetActivityLikes
 * @param {string} activityId (path) The id of the activity
 * @version 1.3
 **/

export const ACTIVITY_LIKES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "LIKES",
];

export const SET_ACTIVITY_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityLikes>>
) => {
  client.setQueryData(ACTIVITY_LIKES_QUERY_KEY(...keyParams), response);
};

interface GetActivityLikesProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityLikes = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivityLikesProps): Promise<ConnectedXMResponse<Like[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/likes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetActivityLikes = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityLikes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityLikes>>
  >(
    ACTIVITY_LIKES_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityLikes({ activityId, ...params }),
    params,
    {
      ...options,
      enabled: !!activityId && (options.enabled ?? true),
    },
    "activities"
  );
};
