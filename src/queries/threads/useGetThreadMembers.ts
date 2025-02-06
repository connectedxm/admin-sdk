import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import { THREADS_QUERY_KEY } from "./useGetThreads";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * Endpoint to retrieve a list of members within a specific thread, with optional filtering by role.
 * This function allows users to fetch thread members, providing the ability to filter results based on the role of the members.
 * It is designed for applications that require detailed member information within a thread context.
 * @name GetThreadMembers
 * @param {string} threadId (path) The id of the thread
 * @param {string} [role] (query) The role to filter thread members by
 * @version 1.3
 **/

export const THREAD_MEMBERS_QUERY_KEY = (threadId: string) => [
  ...THREADS_QUERY_KEY(),
  "MEMBERS",
  threadId,
];

interface GetThreadMembersProps extends InfiniteQueryParams {
  threadId: string;
  role?: string;
}

export const GetThreadMembers = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
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