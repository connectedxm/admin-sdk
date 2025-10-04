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
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_ADDRESSES_QUERY_KEY = (accountId: string) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "ADDRESSES"];
  return keys;
};

/**
 * @category Setters
 * @group Accounts
 */
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

/**
 * @category Queries
 * @group Accounts
 */
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
/**
 * @category Hooks
 * @group Accounts
 */
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
    }
  );
};
