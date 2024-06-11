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
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_FOLLOWERS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWERS",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_FOLLOWERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_FOLLOWERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountFollowers>>
) => {
  client.setQueryData(ACCOUNT_FOLLOWERS_QUERY_KEY(...keyParams), response);
};

interface GetAccountFollowersProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountFollowers = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountFollowersProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/followers`, {
    params: {
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
 * @group Accounts
 */
export const useGetAccountFollowers = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowers>>
  >(
    ACCOUNT_FOLLOWERS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowers({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
