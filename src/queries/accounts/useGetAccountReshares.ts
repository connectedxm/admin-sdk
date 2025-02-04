import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Activity } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches a list of reshares for a specific account.
 * This function retrieves data about account reshares, allowing applications to display or process reshare activities associated with a given account.
 * It is designed to be used in scenarios where understanding the reshare activity of an account is necessary.
 * @name GetAccountReshares
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_RESHARES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "RESHARES",
];

export const SET_ACCOUNT_RESHARES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_RESHARES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountReshares>>
) => {
  client.setQueryData(ACCOUNT_RESHARES_QUERY_KEY(...keyParams), response);
};

interface GetAccountResharesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountReshares = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountResharesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/reshares`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountReshares = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountReshares>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountReshares>>
  >(
    ACCOUNT_RESHARES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountReshares({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};