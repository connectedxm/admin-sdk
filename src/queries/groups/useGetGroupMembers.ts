import { ConnectedXMResponse } from "@src/interfaces";
import { GroupMembership } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the list of members belonging to a specific group.
 * This function is used to fetch group membership details, providing a paginated list of members.
 * It is designed for applications that need to display or manage group members.
 * @name GetGroupMembers
 * @param {string} groupId (path) - The id of the group
 * @version 1.3
 **/

export const GROUP_MEMBERS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "MEMBERS",
];

export const SET_GROUP_MEMBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_MEMBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupMembers>>
) => {
  client.setQueryData(GROUP_MEMBERS_QUERY_KEY(...keyParams), response);
};

interface GetGroupMembersProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupMembers = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupMembersProps): Promise<ConnectedXMResponse<GroupMembership[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/members`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupMembers = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupMembers>>>(
    GROUP_MEMBERS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) => GetGroupMembers({ ...params, groupId }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    },
    "groups"
  );
};