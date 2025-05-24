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
export const DIRECT_THREADS_QUERY_KEY = () => {
  const keys = ["THREADS", "DIRECT"];

  return keys;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_DIRECT_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof DIRECT_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetDirectThreads>>
) => {
  client.setQueryData(DIRECT_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetDirectThreadsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @thread Threads
 */
export const GetDirectThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetDirectThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/direct`, {
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
export const useGetDirectThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetDirectThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetDirectThreads>>
  >(
    DIRECT_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetDirectThreads({
        ...params,
      }),
    params,
    options,
    "threads"
  );
};
