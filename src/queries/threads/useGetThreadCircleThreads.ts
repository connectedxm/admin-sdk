import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Thread } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { THREAD_CIRCLE_QUERY_KEY } from "./useGetThreadCircle";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLE_THREADS_QUERY_KEY = (circleId: string) => [
  THREAD_CIRCLE_QUERY_KEY(circleId),
  circleId,
  "THREADS",
];

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREAD_CIRCLE_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircleThreads>>
) => {
  client.setQueryData(THREAD_CIRCLE_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetThreadCircleThreadsProps extends InfiniteQueryParams {
  circleId: string;
}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircleThreads = async ({
  circleId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadCircleThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/circles/${circleId}/threads`, {
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
 * @group Threads
 */
export const useGetThreadCircleThreads = (
  circleId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadCircleThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadCircleThreads>>
  >(
    THREAD_CIRCLE_THREADS_QUERY_KEY(circleId),
    (params: InfiniteQueryParams) =>
      GetThreadCircleThreads({ circleId, ...params }),
    params,
    options,
    "threads"
  );
};
