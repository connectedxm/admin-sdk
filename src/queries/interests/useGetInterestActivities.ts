import { GetAdminAPI } from "@src/AdminAPI";
import { ActivityStatus, ConnectedXMResponse } from "@src/interfaces";

import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { INTEREST_QUERY_KEY } from "./useGetInterest";

/**
 * @category Keys
 * @group Interests
 */
export const INTEREST_ACTIVITIES_QUERY_KEY = (
  interestId: string,
  status?: keyof typeof ActivityStatus
) => {
  const key = [...INTEREST_QUERY_KEY(interestId), "ACTIVITIES"];
  if (status) {
    key.push(status);
  }
  return key;
};

/**
 * @category Setters
 * @group Interests
 */
export const SET_INTEREST_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTEREST_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterestActivities>>
) => {
  client.setQueryData(INTEREST_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetInterestActivitiesProps extends InfiniteQueryParams {
  interestId: string;
  status?: keyof typeof ActivityStatus;
}

/**
 * @category Queries
 * @group Interests
 */
export const GetInterestActivities = async ({
  interestId,
  status,
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
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Interests
 */
export const useGetInterestActivities = (
  interestId: string = "",
  status?: keyof typeof ActivityStatus,
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
    INTEREST_ACTIVITIES_QUERY_KEY(interestId, status),
    (params: InfiniteQueryParams) =>
      GetInterestActivities({ interestId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!interestId && (options.enabled ?? true),
    },
    "interests"
  );
};
