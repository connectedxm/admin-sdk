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
export const PUBLIC_THREADS_QUERY_KEY = () => {
  const keys = ["THREADS", "PUBLIC"];

  return keys;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_PUBLIC_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PUBLIC_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPublicThreads>>
) => {
  client.setQueryData(PUBLIC_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetPublicThreadsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @thread Threads
 */
export const GetPublicThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetPublicThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/public`, {
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
export const useGetPublicThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetPublicThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetPublicThreads>>
  >(
    PUBLIC_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetPublicThreads({
        ...params,
      }),
    params,
    options,
    "threads"
  );
};
