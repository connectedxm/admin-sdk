import { AccountAddress, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to fetch a list of account addresses with support for pagination and filtering.
 * This function allows retrieval of addresses associated with a specific account, providing options for pagination and filtering.
 * It is designed to be used in applications where account address information is needed.
 * @name GetAccountAddresses
 * @param {string} accountId (path) The id of the account
 * @version 1.3
 **/

export const ACCOUNT_ADDRESSES_QUERY_KEY = (accountId: string) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "ADDRESSES"];
  return keys;
};

export const SET_ACCOUNT_ADDRESSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_ADDRESSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountAddresses>>
) => {
  client.setQueryData(ACCOUNT_ADDRESSES_QUERY_KEY(...keyParams), response);
};

interface GetAccountAddressesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountAddresses = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountAddressesProps): Promise<
  ConnectedXMResponse<AccountAddress[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/addresses`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetAccountAddresses = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountAddresses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountAddresses>>
  >(
    ACCOUNT_ADDRESSES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountAddresses({
        ...params,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    },
    "accounts"
  );
};
