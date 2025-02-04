import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of sponsors associated with a specific group.
 * This function allows users to fetch sponsor details for a given group by providing the group ID.
 * It is designed to be used in applications where information about group sponsors is required.
 * @name GetGroupSponsors
 * @param {string} groupId - The id of the group
 * @version 1.2
 **/

export const GROUP_SPONSORS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "SPONSORS",
];

export const SET_GROUP_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupSponsors>>
) => {
  client.setQueryData(GROUP_SPONSORS_QUERY_KEY(...keyParams), response);
};

interface GetGroupSponsorsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupSponsors = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupSponsors = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupSponsors>>
  >(
    GROUP_SPONSORS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) => GetGroupSponsors({ ...params, groupId }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};