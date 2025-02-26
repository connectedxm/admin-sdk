import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadType } from "@src/interfaces";
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
export const THREADS_QUERY_KEY = (type?: keyof typeof ThreadType) => {
  const keys = ["THREADS"];

  if (type) keys.push(type);

  return keys;
};

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreads>>
) => {
  client.setQueryData(THREADS_QUERY_KEY(...keyParams), response);
};

interface GetThreadsProps extends InfiniteQueryParams {
  type?: keyof typeof ThreadType;
}

/**
 * @category Queries
 * @thread Threads
 */
export const GetThreads = async ({
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type: type || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @thread Threads
 */
export const useGetThreads = (
  type?: keyof typeof ThreadType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetThreads>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreads>>>(
    THREADS_QUERY_KEY(type),
    (params: InfiniteQueryParams) =>
      GetThreads({
        ...params,
        type,
      }),
    params,
    options,
    "threads"
  );
};
