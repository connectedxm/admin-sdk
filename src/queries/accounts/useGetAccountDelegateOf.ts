import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Account } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_DELEGATE_OF_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "DELEGATE_OF",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_DELEGATE_OF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_DELEGATE_OF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountDelegateOf>>
) => {
  client.setQueryData(ACCOUNT_DELEGATE_OF_QUERY_KEY(...keyParams), response);
};

interface GetAccountDelegateOfProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountDelegateOf = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountDelegateOfProps): Promise<ConnectedXMResponse<Account[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/delegate-of`, {
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
export const useGetAccountDelegateOf = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountDelegateOf>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountDelegateOf>>
  >(
    ACCOUNT_DELEGATE_OF_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountDelegateOf({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
