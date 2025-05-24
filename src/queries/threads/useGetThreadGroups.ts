import { ConnectedXMResponse, Group } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @thread Thread Members
 */
export const THREAD_GROUPS_QUERY_KEY = (threadId: string) => [
  "THREADS",
  threadId,
  "GROUPS",
];

interface GetThreadGroupsProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Thread Members
 */
export const GetThreadGroups = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/groups`, {
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
 * @thread Thread Members
 */
export const useGetThreadGroups = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadGroups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreadGroups>>>(
    THREAD_GROUPS_QUERY_KEY(threadId),
    (params: InfiniteQueryParams) => GetThreadGroups({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    },
    "threads"
  );
};
