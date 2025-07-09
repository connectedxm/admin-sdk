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
 * @category Keys
 * @group Groups
 */
export const GROUP_ACTIVITIES_QUERY_KEY = (
  groupId: string,
  featured?: true
) => {
  const key = [...GROUP_QUERY_KEY(groupId), "ACTIVITIES"];
  if (featured) {
    key.push("FEATURED");
  }
  return key;
};

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupActivities>>
) => {
  client.setQueryData(GROUP_ACTIVITIES_QUERY_KEY(...keyParams), response);
};

interface GetGroupActivitiesProps extends InfiniteQueryParams {
  groupId: string;
  featured?: true;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupActivities = async ({
  groupId,
  featured,
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
      featured: featured || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupActivities = (
  groupId: string = "",
  featured?: true,
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
    GROUP_ACTIVITIES_QUERY_KEY(groupId, featured),
    (params: InfiniteQueryParams) =>
      GetGroupActivities({
        groupId,
        featured,
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
