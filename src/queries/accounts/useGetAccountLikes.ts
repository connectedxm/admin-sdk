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
 * Retrieves a list of likes associated with a specific account.
 * This function fetches likes for a given account using an infinite query, allowing for paginated data retrieval.
 * It is useful in scenarios where an application needs to display or process the likes related to an account.
 * @name GetAccountLikes
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export const ACCOUNT_LIKES_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "LIKES",
];

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
    },
    "accounts"
  );
};