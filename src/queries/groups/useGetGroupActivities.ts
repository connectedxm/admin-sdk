import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to fetch activities for a specific group.
 * This function retrieves a list of activities associated with a given group ID.
 * It is designed to be used in applications where tracking or displaying group activities is required.
 * @name GetGroupActivities
 * @param {string} groupId (path) The id of the group
 * @version 1.3
 **/

export const GROUP_ACTIVITIES_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "ACTIVITIES",
];

export const SET_GROUP_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupActivities>>
) => {
  client.setQueryData(GROUP_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetGroupActivitiesProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupActivities = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupActivities = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupActivities>>
  >(
    GROUP_ACTIVITIES_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetGroupActivities({
        groupId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};
