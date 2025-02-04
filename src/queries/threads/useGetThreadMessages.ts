import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY, SET_THREAD_QUERY_DATA } from "./useGetThread";
import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

export const THREAD_MESSAGES_QUERY_KEY = (
  threadId: string,
  messageId?: string
): QueryKey => [...THREAD_QUERY_KEY(threadId, messageId), "MESSAGES"];

export const SET_THREAD_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadMessagesProps extends InfiniteQueryParams {
  threadId: string;
}

/**
 * @name List Thread Messages
 * @description Retrieve a list of messages for a thread
 * @category Queries
 * @group Threads
 */
export const GetThreadMessages = async ({
  threadId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  adminApiParams,
}: GetThreadMessagesProps): Promise<ConnectedXMResponse<ThreadMessage[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/messages`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(data, queryClient, (messageId) =>
      THREAD_MESSAGE_QUERY_KEY(threadId, messageId)
    );
    SET_THREAD_QUERY_DATA(queryClient, [threadId], (old) => ({
      ...old,
      data: {
        ...old.data,
        read: true,
      },
    }));
  }

  return data;
};

export const useGetThreadMessages = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessages>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessages>>
  >(
    THREAD_MESSAGES_QUERY_KEY(threadId),
    (params: Omit<GetThreadMessagesProps, "threadId">) =>
      GetThreadMessages({ ...params, threadId }),
    params,
    {
      refetchInterval: 5 * 1000,
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    },
    "threads"
  );
};
