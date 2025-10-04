import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadType } from "@src/interfaces";
import { Thread } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Threads
 */
export const THREADS_QUERY_KEY = (type?: keyof typeof ThreadType) => {
  const key = ["THREADS"];
  if (type) key.push(type);
  return key;
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
 * @group Threads
 */
export const GetThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
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
 * @group Threads
 */
export const useGetThreads = (
  type?: keyof typeof ThreadType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > & {
    circleId?: string;
    groupId?: string;
  } = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetThreads>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreads>>>(
    THREADS_QUERY_KEY(type),
    (params: InfiniteQueryParams) => GetThreads({ ...params, type }),
    params,
    options
  );
};
