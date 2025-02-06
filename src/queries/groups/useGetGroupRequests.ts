import {
  ConnectedXMResponse,
  GroupRequest,
  GroupRequestStatus,
} from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve and manage group requests for a specific group.
 * This function allows users to fetch and handle requests associated with a group, filtered by request status.
 * It is designed to be used in applications where managing group membership requests is necessary.
 * @name GetGroupRequests
 * @param {string} groupId (path) - The id of the group
 * @param {keyof typeof GroupRequestStatus} status (query) - The status of the group request
 * @version 1.3
 **/

export const GROUP_REQUESTS_QUERY_KEY = (
  groupId: string,
  status?: keyof typeof GroupRequestStatus
) => {
  const keys = [...GROUP_QUERY_KEY(groupId), "REQUESTS"];
  if (status) keys.push(status);
  return keys;
};

export const SET_GROUP_REQUESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_REQUESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupRequests>>
) => {
  client.setQueryData(GROUP_REQUESTS_QUERY_KEY(...keyParams), response);
};

interface GetGroupRequestsProps extends InfiniteQueryParams {
  groupId: string;
  status: keyof typeof GroupRequestStatus;
}

export const GetGroupRequests = async ({
  groupId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupRequestsProps): Promise<ConnectedXMResponse<GroupRequest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/requests`, {
    params: {
      status,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupRequests = (
  groupId: string = "",
  status: keyof typeof GroupRequestStatus = GroupRequestStatus.requested,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupRequests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupRequests>>
  >(
    GROUP_REQUESTS_QUERY_KEY(groupId, status),
    (params: InfiniteQueryParams) =>
      GetGroupRequests({
        groupId,
        status,
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
