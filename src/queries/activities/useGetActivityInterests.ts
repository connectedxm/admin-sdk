import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Interest } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Activities
 */
export const ACTIVITY_INTERESTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "INTERESTS",
];

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITY_INTEREST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityInterests>>
) => {
  client.setQueryData(ACTIVITY_INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetActivityInterestsProps extends InfiniteQueryParams {
  activityId: string;
}

/**
 * @category Queries
 * @group Activities
 */
export const GetActivityInterests = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivityInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/interests`, {
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
export const useGetActivityInterests = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityInterests>>
  >(
    ACTIVITY_INTERESTS_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityInterests({ activityId, ...params }),
    params,
    {
      ...options,
      enabled: !!activityId && (options.enabled ?? true),
    },
    "activities"
  );
};
