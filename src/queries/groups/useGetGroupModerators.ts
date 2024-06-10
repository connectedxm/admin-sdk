import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { GroupMembership } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient } from "@tanstack/react-query";

export const GROUP_MODERATORS_QUERY_KEY = (groupId: string) => [
  ...GROUP_QUERY_KEY(groupId),
  "MODERATORS",
];

export const SET_GROUP_MODERATORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_MODERATORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupModerators>>
) => {
  client.setQueryData(GROUP_MODERATORS_QUERY_KEY(...keyParams), response);
};

interface GetGroupModeratorsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupModerators = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetGroupModeratorsProps): Promise<
  ConnectedXMResponse<GroupMembership[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups/${groupId}/moderators`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetGroupModerators = (groupId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupModerators>>
  >(
    GROUP_MODERATORS_QUERY_KEY(groupId),
    (params: any) => GetGroupModerators(params),
    {
      groupId,
    },
    {
      enabled: !!groupId,
    }
  );
};

export default useGetGroupModerators;
