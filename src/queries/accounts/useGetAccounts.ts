import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNTS_QUERY_KEY = (accountType?: "account" | "team", verified?: boolean, online?: boolean) => {
  const keys = ["ACCOUNTS"];
  if (accountType) keys.push(accountType);
  if (typeof verified !== "undefined") keys.push(verified ? "VERIFIED" : "UNVERIFIED");
  if (typeof online !== "undefined") keys.push(online ? "ONLINE" : "OFFLINE");
  return keys;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccounts>>
) => {
  client.setQueryData(ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountsProps extends InfiniteQueryParams {
  accountType?: "account" | "team";
  verified?: boolean;
  online?: boolean;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  accountType,
  search,
  adminApiParams,
  verified,
  online,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      accountType: accountType || undefined,
      search: search || undefined,
      verified: verified || undefined,
      online: online || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccounts = (
  accountType?: "account" | "team",
  verified?: boolean,
  online?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAccounts>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(accountType, verified, online),
    (params: InfiniteQueryParams) => GetAccounts({ ...params, accountType, verified, online }),
    params,
    options,
    "accounts"
  );
};
