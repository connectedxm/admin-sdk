import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @thread Threads
 */
export const THREAD_MODERATORS_QUERY_KEY = (threadId: string) => [
  ...THREAD_QUERY_KEY(threadId),
  "MODERATORS",
];

/**
 * @category Setters
 * @thread Threads
 */
export const SET_THREAD_MODERATORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MODERATORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadModerators>>
) => {
  client.setQueryData(THREAD_MODERATORS_QUERY_KEY(...keyParams), response);
};

interface GetThreadModeratorsProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Threads
 */
export const GetThreadModerators = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadModeratorsProps): Promise<ConnectedXMResponse<ThreadMember[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/moderators`, {
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
export const useGetThreadModerators = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadModerators>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadModerators>>
  >(
    THREAD_MODERATORS_QUERY_KEY(threadId),
    (params: InfiniteQueryParams) =>
      GetThreadModerators({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    },
    "threads"
  );
};
