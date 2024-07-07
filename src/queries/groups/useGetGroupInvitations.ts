import {
  ConnectedXMResponse,
  GroupInvitation,
  GroupInvitationStatus,
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
 * @category Keys
 * @group Groups
 */
export const GROUP_INVITATIONS_QUERY_KEY = (
  groupId: string,
  status?: keyof typeof GroupInvitationStatus
) => {
  const keys = [...GROUP_QUERY_KEY(groupId), "INVITATIONS"];
  if (status) keys.push(status);
  return keys;
};

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUP_INVITATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_INVITATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupInvitations>>
) => {
  client.setQueryData(GROUP_INVITATIONS_QUERY_KEY(...keyParams), response);
};

interface GetGroupInvitationsProps extends InfiniteQueryParams {
  groupId: string;
  status: keyof typeof GroupInvitationStatus;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroupInvitations = async ({
  groupId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupInvitationsProps): Promise<
  ConnectedXMResponse<GroupInvitation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/invitations`, {
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
/**
 * @category Hooks
 * @group Groups
 */
export const useGetGroupInvitations = (
  groupId: string = "",
  status: keyof typeof GroupInvitationStatus = GroupInvitationStatus.invited,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupInvitations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupInvitations>>
  >(
    GROUP_INVITATIONS_QUERY_KEY(groupId, status),
    (params: InfiniteQueryParams) =>
      GetGroupInvitations({
        groupId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!groupId && (options.enabled ?? true),
    }
  );
};
