import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of activities.
 * This function fetches a paginated list of activities from the server, allowing for optional sorting and searching.
 * It is designed to be used in applications where activity data needs to be displayed or processed.
 * @name GetActivities
 * @version 1.2
 **/

export const ACTIVITIES_QUERY_KEY = () => ["ACTIVITIES"];

export const SET_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivities>>
) => {
  client.setQueryData(ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetActivitiesProps extends InfiniteQueryParams {}

export const GetActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetActivities = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetActivities>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetActivities({ ...params }),
    params,
    options,
    "activities"
  );
};