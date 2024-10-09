import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Group } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Groups
 */
export const GROUPS_QUERY_KEY = (
  access?: "public" | "private",
  featured?: boolean
) => {
  const keys = ["GROUPS"];
  if (access) keys.push(access);
  if (featured) keys.push("FEATURED");
  return keys;
};

/**
 * @category Setters
 * @group Groups
 */
export const SET_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroups>>
) => {
  client.setQueryData(GROUPS_QUERY_KEY(...keyParams), response);
};

interface GetGroupsProps extends InfiniteQueryParams {
  access?: "public" | "private";
  featured?: boolean;
}

/**
 * @category Queries
 * @group Groups
 */
export const GetGroups = async ({
  access,
  featured,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/groups`, {
    params: {
      access: access || undefined,
      featured: featured || undefined,
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
export const useGetGroups = (
  access?: "public" | "private",
  featured?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetGroups>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetGroups>>>(
    GROUPS_QUERY_KEY(access, featured),
    (params: InfiniteQueryParams) =>
      GetGroups({
        ...params,
        access,
        featured,
      }),
    params,
    options,
    "groups"
  );
};
