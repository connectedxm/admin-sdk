import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * Endpoint to retrieve a list of accounts that a specified account is following.
 * This function is used to fetch the accounts that are being followed by a particular account, 
 * providing a way to access the following list of a user.
 * @name GetAccountFollowing
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_FOLLOWING_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWING",
];

export const SET_ACCOUNT_FOLLOWING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_FOLLOWING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountFollowing>>
) => {
  client.setQueryData(ACCOUNT_FOLLOWING_QUERY_KEY(...keyParams), response);
};

interface GetAccountFollowingProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountFollowing = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountFollowingProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/following`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountFollowing = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowing>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowing>>
  >(
    ACCOUNT_FOLLOWING_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowing({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};