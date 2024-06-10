import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Group } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const GROUPS_QUERY_KEY = () => ["GROUPS"];

export const SET_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroups>>
) => {
  client.setQueryData(GROUPS_QUERY_KEY(...keyParams), response);
};

interface GetGroupsProps extends InfiniteQueryParams {}

export const GetGroups = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetGroups = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroups>>>(
    GROUPS_QUERY_KEY(),
    (params: any) => GetGroups(params),
    {},
    {}
  );
};

export default useGetGroups;
