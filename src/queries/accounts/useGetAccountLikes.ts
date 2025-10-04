import { ConnectedXMResponse } from "@src/interfaces";

import { Like } from "@src/interfaces";
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
export const ACCOUNT_LIKES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "LIKES",
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountLikes>>
) => {
  client.setQueryData(ACCOUNT_LIKES_QUERY_KEY(...keyParams), response);
};

interface GetAccountLikesProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountLikes = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountLikesProps): Promise<ConnectedXMResponse<Like[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/likes`, {
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
export const useGetAccountLikes = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountLikes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccountLikes>>>(
    ACCOUNT_LIKES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) => GetAccountLikes({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    }
  );
};
