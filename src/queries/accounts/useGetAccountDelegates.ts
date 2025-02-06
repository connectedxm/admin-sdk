import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves a list of delegates associated with a specific account.
 * This function is designed to fetch account delegates, providing detailed information about each delegate.
 * It is useful in scenarios where an application needs to display or manage account delegates.
 * @name GetAccountDelegates
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_DELEGATES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "DELEGATES",
];

export const SET_ACCOUNT_DELEGATES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_DELEGATES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountDelegates>>
) => {
  client.setQueryData(ACCOUNT_DELEGATES_QUERY_KEY(...keyParams), response);
};

interface GetAccountDelegatesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountDelegates = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountDelegatesProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/delegates`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountDelegates = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountDelegates>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountDelegates>>
  >(
    ACCOUNT_DELEGATES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountDelegates({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
