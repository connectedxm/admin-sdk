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
 * @category Keys
 * @group Activities
 */
export const ACTIVITY_LIKES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "LIKES",
];

/**
 * @category Setters
 * @group Activities
 */
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

/**
 * @category Queries
 * @group Activities
 */
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
/**
 * @category Hooks
 * @group Activities
 */
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
