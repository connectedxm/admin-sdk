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
 * Fetch a list of groups with optional filtering by access level and featured status.
 * This function allows retrieval of group data, supporting filters for access level and featured status.
 * It is useful for applications that need to display or manage groups with specific characteristics.
 * @name GetGroups
 * @param {string} [access] (query) The access level of the groups
 * @param {boolean} [featured] (query) Whether to filter groups by featured status
 * @version 1.3
 **/

export const GROUPS_QUERY_KEY = (
  access?: "public" | "private",
  featured?: boolean
) => {
  const keys = ["GROUPS"];
  if (access) keys.push(access);
  if (featured) keys.push("FEATURED");
  return keys;
};

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
