import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export const THREADS_QUERY_KEY = (
  access?: "public" | "private",
  groupId?: string,
  eventId?: string
) => {
  const keys = ["THREADS"];
  if (access) keys.push(access);
  if (groupId) keys.push(groupId);
  if (eventId) keys.push(eventId);
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
  access?: "public" | "private";
  groupId?: string;
  eventId?: string;
}

/**
 * @category Queries
 * @thread Threads
 */
export const GetThreads = async ({
  pageParam,
  pageSize,
  orderBy,
  access,
  groupId,
  eventId,
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
      access: access || undefined,
      groupId: groupId || undefined,
      eventId: eventId || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @thread Threads
 */
export const useGetThreads = (
  access?: "public" | "private",
  groupId?: string,
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetThreads>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreads>>>(
    THREADS_QUERY_KEY(access, groupId, eventId),
    (params: InfiniteQueryParams) =>
      GetThreads({
        ...params,
        access,
        groupId,
        eventId,
      }),
    params,
    options,
    "threads"
  );
};
