import { ConnectedXMResponse } from "@src/interfaces";
import { GroupMembership } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of groups associated with a specific account.
 * This function fetches group membership details for a given account, allowing applications to display or manage account groups.
 * It is designed to be used in scenarios where group information for an account is needed.
 * @name GetAccountGroups
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_GROUPS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "GROUPS",
];

export const SET_ACCOUNT_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_GROUPS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountGroups>>
) => {
  client.setQueryData(ACCOUNT_GROUPS_QUERY_KEY(...keyParams), response);
};

interface GetAccountGroupsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountGroups = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountGroupsProps): Promise<ConnectedXMResponse<GroupMembership[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountGroups = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountGroups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountGroups>>
  >(
    ACCOUNT_GROUPS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) => GetAccountGroups({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
