import {
  ConnectedXMResponse,
  ThreadMember,
  ThreadMemberRole,
} from "@src/interfaces";
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
export const THREAD_MEMBERS_QUERY_KEY = (
  threadId: string,
  role?: keyof typeof ThreadMemberRole
) => {
  const key = ["THREADS", threadId, "MEMBERS"];
  if (role) {
    key.push(role);
  }
  return key;
};

interface GetThreadMembersProps extends InfiniteQueryParams {
  threadId: string;
  role?: keyof typeof ThreadMemberRole;
}

/**
 * @category Queries
 * @thread Thread Members
 */
export const GetThreadMembers = async ({
  threadId,
  role,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadMembersProps): Promise<ConnectedXMResponse<ThreadMember[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/members`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      role: role || undefined,
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
  role?: keyof typeof ThreadMemberRole,
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
    THREAD_MEMBERS_QUERY_KEY(threadId, role),
    (params: InfiniteQueryParams) => GetThreadMembers({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!threadId && (options.enabled ?? true),
    },
    "threads"
  );
};
