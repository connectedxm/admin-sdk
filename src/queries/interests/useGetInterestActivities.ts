import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INTEREST_QUERY_KEY } from "./useGetInterest";

/**
 * Endpoint to retrieve a list of activities associated with a specific interest.
 * This function is designed to fetch activities related to a given interest ID, 
 * providing a paginated and optionally sorted list of activities.
 * It is useful for applications that need to display or process activities linked to specific interests.
 * @name GetInterestActivities
 * @param {string} interestId (path) - The id of the interest
 * @version 1.3
 **/

export const INTEREST_ACTIVITIES_QUERY_KEY = (interestId: string) => [
  ...INTEREST_QUERY_KEY(interestId),
  "ACTIVITIES",
];

export const SET_INTEREST_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestActivities>>
) => {
  client.setQueryData(INTEREST_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetInterestActivitiesProps extends InfiniteQueryParams {
  interestId: string;
}

export const GetInterestActivities = async ({
  interestId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetInterestActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/interests/${interestId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetInterestActivities = (
  interestId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestActivities>>
  >(
    INTEREST_ACTIVITIES_QUERY_KEY(interestId),
    (params: InfiniteQueryParams) =>
      GetInterestActivities({ interestId, ...params }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    },
    "interests"
  );
};