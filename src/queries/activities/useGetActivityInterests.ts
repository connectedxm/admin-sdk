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
 * Retrieves a list of interests associated with a specific activity.
 * This function is used to fetch interests for a given activity, allowing applications to display or process these interests.
 * It supports infinite scrolling through pagination parameters.
 * @name GetActivityInterests
 * @param {string} activityId (path) - The id of the activity
 * @version 1.3
 **/

export const ACTIVITY_INTERESTS_QUERY_KEY = (activityId: string) => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "INTERESTS",
];

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