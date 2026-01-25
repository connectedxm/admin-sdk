import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { THREAD_QUERY_KEY } from "../useGetThread";

/**
 * @category Keys
 * @thread Thread Viewers
 */
export const THREAD_MEMBERS_QUERY_KEY = (threadId: string) => {
  const key = [...THREAD_QUERY_KEY(threadId), "VIEWERS"];
  return key;
};

interface GetThreadMembersProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @category Queries
 * @thread Thread Viewers
 */
export const GetThreadMembers = async ({
  threadId,
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
    },
  });
  return data;
};

/**
 * @category Hooks
 * @thread Thread Viewers
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
    }
  );
};
