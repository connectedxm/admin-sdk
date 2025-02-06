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
 * Endpoint to fetch interests associated with a specific account.
 * This function provides the ability to retrieve account interests with support for optional filtering and pagination.
 * It is useful for applications that need to display or process interest data linked to user accounts.
 * @name GetAccountInterests
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/

export const ACCOUNT_INTERESTS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "INTERESTS",
];

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
    },
    "accounts"
  );
};