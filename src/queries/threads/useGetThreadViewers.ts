import { ConnectedXMResponse, ThreadViewer } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { THREAD_QUERY_KEY } from "./useGetThread";

/**
 * @category Keys
 * @thread Thread Viewers
 */
export const THREAD_VIEWERS_QUERY_KEY = (threadId: string) => {
  const key = [...THREAD_QUERY_KEY(threadId), "VIEWERS"];
  return key;
};

interface GetThreadViewersProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Thread Viewers
 */
export const GetThreadViewers = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadViewersProps): Promise<ConnectedXMResponse<ThreadViewer[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/viewers`, {
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
 * @thread Thread Viewers
 */
export const useGetThreadViewers = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadViewers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadViewers>>
  >(
    THREAD_VIEWERS_QUERY_KEY(threadId),
    (params: InfiniteQueryParams) => GetThreadViewers({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    },
    "threads"
  );
};
