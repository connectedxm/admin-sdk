import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "@src/queries/useConnectedInfiniteQuery";
import {
  CursorQueryOptions,
  CursorQueryParams,
  useConnectedCursorQuery,
} from "@src/queries/useConnectedCursorQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

export const THREAD_MESSAGES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "MESSAGES",
];

export const SET_THREAD_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = [""]
) => {
  client.setQueryData(
    [
      ...THREAD_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadMessagesProps extends CursorQueryParams {
  threadId: string;
}

export const GetThreadMessages = async ({
  threadId,
  cursor,
  pageSize,
  orderBy,
  search,
  queryClient,
  adminApiParams,
}: GetThreadMessagesProps): Promise<ConnectedXMResponse<ThreadMessage[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/messages`, {
    params: {
      cursor: cursor || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(data, queryClient, (messageId) =>
      THREAD_MESSAGE_QUERY_KEY(threadId, messageId)
    );
  }

  return data;
};

export const useGetThreadMessages = (
  threadId: string = "",
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {},
  options: CursorQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessages>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedCursorQuery<Awaited<ReturnType<typeof GetThreadMessages>>>(
    THREAD_MESSAGES_QUERY_KEY(threadId),
    (params: Omit<GetThreadMessagesProps, "threadId">) =>
      GetThreadMessages({ ...params, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
