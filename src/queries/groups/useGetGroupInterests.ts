import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Interest } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of interests associated with a specific group.
 * This function fetches interests for a given group, allowing applications to display or process group-related interests.
 * It is designed to be used in scenarios where understanding or displaying group interests is necessary.
 * @name GetGroupInterests
 * @param {string} groupId - The id of the group
 * @version 1.2
 **/

export const GROUP_INTERESTS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "INTERESTS",
];

export const SET_GROUP_INTERESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupInterests>>
) => {
  client.setQueryData(GROUP_INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetGroupInterestsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupInterests = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupInterests = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupInterests>>
  >(
    GROUP_INTERESTS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetGroupInterests({
        ...params,
        groupId,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};