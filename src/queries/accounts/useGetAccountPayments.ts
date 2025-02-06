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
 * Retrieves a list of payments associated with a specific account.
 * This function fetches payment data for a given account ID, supporting pagination and sorting options.
 * It is intended for use in applications that require detailed payment history for user accounts.
 * @name GetAccountPayments
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/

export const ACCOUNT_PAYMENTS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "PAYMENTS",
];

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