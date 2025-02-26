import { ConnectedXMResponse, Group, ThreadMember } from "@src/interfaces";
import { THREADS_QUERY_KEY } from "./useGetThreads";
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
export const THREAD_MEMBERS_QUERY_KEY = (threadId: string) => [
  ...THREADS_QUERY_KEY(),
  "MEMBERS",
  threadId,
];

interface GetThreadMembersProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Thread Members
 */
export const GetThreadMembers = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadMembersProps): Promise<
  ConnectedXMResponse<{ groups: Group; members: ThreadMember[] }>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/members`, {
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
export const useGetThreadMembers = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMembers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMembers>>
  >(
    THREAD_MEMBERS_QUERY_KEY(threadId),
    (params: InfiniteQueryParams) => GetThreadMembers({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    },
    "threads"
  );
};
