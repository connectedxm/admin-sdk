import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Thread } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Threads
 */
export const ACCOUNT_THREADS_QUERY_KEY = (accountId: string) => {
  const keys = ["THREADS", "ACCOUNT", accountId];

  return keys;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_ACCOUNT_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountThreads>>
) => {
  client.setQueryData(ACCOUNT_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetAccountThreadsProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @thread Threads
 */
export const GetAccountThreads = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/threads`, {
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
 * @thread Threads
 */
export const useGetAccountThreads = (
  accountId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountThreads>>
  >(
    ACCOUNT_THREADS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountThreads({
        ...params,
        accountId,
      }),
    params,
    {
      enabled: !!accountId && (options.enabled ?? true),
      ...options,
    },
    "threads"
  );
};
