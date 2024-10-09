import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
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
export const ACTIVITY_RESHARES_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "RESHARES",
];

/**
 * @category Setters
 * @group Activities
 */
export const SET_ACTIVITY_RESHARES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_RESHARES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityReshares>>
) => {
  client.setQueryData(ACTIVITY_RESHARES_QUERY_KEY(...keyParams), response);
};

interface GetActivityResharesProps extends InfiniteQueryParams {
  activityId: string;
}

/**
 * @category Queries
 * @group Activities
 */
export const GetActivityReshares = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivityResharesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities/${activityId}/reshares`, {
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
export const useGetActivityReshares = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityReshares>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityReshares>>
  >(
    ACTIVITY_RESHARES_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityReshares({ activityId, ...params }),
    params,
    {
      ...options,
      enabled: !!activityId && (options.enabled ?? true),
    },
    "activities"
  );
};
