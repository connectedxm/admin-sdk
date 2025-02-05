import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

/**
 * Endpoint to retrieve a list of replies for a specific message in a thread.
 * This function fetches replies associated with a particular message within a thread, 
 * allowing users to view the conversation flow. It is useful in applications where 
 * threaded discussions or message replies need to be displayed.
 * @name GetThreadMessageReplies
 * @param {string} threadId - The id of the thread
 * @param {string} messageId - The id of the message
 * @version 1.2
 */

export const THREAD_MESSAGE_REPLIES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "REPLIES"];

export const SET_THREAD_MESSAGE_REPLIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_REPLIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessageReplies>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_MESSAGE_REPLIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadMessageRepliesProps extends InfiniteQueryParams {
  threadId: string;
  messageId: string;
}

export const GetThreadMessageReplies = async ({
  threadId,
  messageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  adminApiParams,
}: GetThreadMessageRepliesProps): Promise<
  ConnectedXMResponse<ThreadMessage[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/messages/${messageId}/replies`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(data, queryClient, (messageId) =>
      THREAD_MESSAGE_QUERY_KEY(threadId, messageId)
    );
  }

  return data;
};

export const useGetThreadMessageReplies = (
  threadId: string = "",
  messageId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessageReplies>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageReplies>>
  >(
    THREAD_MESSAGE_REPLIES_QUERY_KEY(threadId, messageId),
    (params: Omit<GetThreadMessageRepliesProps, "threadId" | "messageId">) =>
      GetThreadMessageReplies({ ...params, threadId, messageId }),
    params,
    {
      refetchInterval: 5 * 1000,
      ...options,
      enabled:
        !!authenticated &&
        !!threadId &&
        !!messageId &&
        (options?.enabled ?? true),
    },
    "threads"
  );
};