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
 * Endpoint to retrieve a list of accounts with optional filtering by account type.
 * This function allows users to fetch a paginated list of accounts, which can be filtered by account type if specified.
 * It is designed to be used in applications where account management and retrieval are necessary.
 * @name GetAccounts
 * @param {string} [accountType] (query) Optional account type ("account" | "team")
 * @version 1.3
 **/

export const ACCOUNTS_QUERY_KEY = (accountType?: "account" | "team") => {
  const keys = ["ACCOUNTS"];
  if (accountType) keys.push(accountType);
  return keys;
};

export const SET_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccounts>>
) => {
  client.setQueryData(ACCOUNTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountsProps extends InfiniteQueryParams {
  accountType?: "account" | "team";
}

export const GetAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  accountType,
  search,
  adminApiParams,
}: GetAccountsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      accountType: accountType || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccounts = (
  accountType?: "account" | "team",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAccounts>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccounts>>>(
    ACCOUNTS_QUERY_KEY(accountType),
    (params: InfiniteQueryParams) => GetAccounts({ ...params, accountType }),
    params,
    options,
    "accounts"
  );
};
