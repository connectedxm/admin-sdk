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
export const PRIVATE_THREADS_QUERY_KEY = () => {
  const keys = ["THREADS", "PRIVATE"];

  return keys;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_PRIVATE_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PRIVATE_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPrivateThreads>>
) => {
  client.setQueryData(PRIVATE_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetPrivateThreadsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @thread Threads
 */
export const GetPrivateThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetPrivateThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/private`, {
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
export const useGetPrivateThreads = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetPrivateThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetPrivateThreads>>
  >(
    PRIVATE_THREADS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetPrivateThreads({
        ...params,
      }),
    params,
    options,
    "threads"
  );
};
