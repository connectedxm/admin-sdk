import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Payment } from "@src/interfaces";
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
export const ACCOUNT_PAYMENTS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "PAYMENTS",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountPayments>>
) => {
  client.setQueryData(ACCOUNT_PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountPaymentsProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountPayments = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/payments`, {
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
export const useGetAccountPayments = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountPayments>>
  >(
    ACCOUNT_PAYMENTS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountPayments({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
