import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Interest } from "@src/interfaces";
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
export const ACCOUNT_INTERESTS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "INTERESTS",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_INTERESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountInterests>>
) => {
  client.setQueryData(ACCOUNT_INTERESTS_QUERY_KEY(...keyParams), response);
};

interface GetAccountInterestsProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountInterests = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/interests`, {
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
export const useGetAccountInterests = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountInterests>>
  >(
    ACCOUNT_INTERESTS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountInterests({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
