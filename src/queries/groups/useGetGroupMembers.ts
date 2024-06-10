import { ConnectedXMResponse } from "@src/interfaces";

import { GroupMembership } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

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

const useGetGroupMembers = (groupId: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroupMembers>>>(
    GROUP_MEMBERS_QUERY_KEY(groupId),
    (params: any) => GetGroupMembers(params),
    {
      groupId,
    },
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupMembers;
