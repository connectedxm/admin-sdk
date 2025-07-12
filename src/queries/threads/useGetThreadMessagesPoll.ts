import { ConnectedXMResponse, ThreadMessage } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedXM } from "@src/hooks";

export const THREAD_MESSAGES_POLL_QUERY_KEY = (
  threadId: string,
  lastMessageId: string
): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "MESSAGES",
  lastMessageId,
  "POLL",
];

export const SET_THREAD_MESSAGES_POLL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGES_POLL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessagesPoll>>
) => {
  client.setQueryData(THREAD_MESSAGES_POLL_QUERY_KEY(...keyParams), response);
};

export interface GetThreadMessagesPollProps extends SingleQueryParams {
  threadId: string;
  lastMessageId: string;
}

export const GetThreadMessagesPoll = async ({
  threadId,
  lastMessageId,
  adminApiParams,
}: GetThreadMessagesPollProps): Promise<
  ConnectedXMResponse<ThreadMessage[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}/messages/poll`, {
    params: {
      lastMessageId: lastMessageId || undefined,
    },
  });

  return data;
};

export const useGetThreadMessagesPoll = (
  threadId: string = "",
  lastMessageId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadMessagesPoll>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetThreadMessagesPoll>>(
    THREAD_MESSAGES_POLL_QUERY_KEY(threadId, lastMessageId),
    (params: SingleQueryParams) =>
      GetThreadMessagesPoll({ ...params, threadId, lastMessageId }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!threadId &&
        !!lastMessageId &&
        (options?.enabled ?? true),
      // Polling configuration - you can adjust these as needed
      refetchInterval: options.refetchInterval ?? 5000, // Poll every 5 seconds
      refetchIntervalInBackground: options.refetchIntervalInBackground ?? false,
    },
    "threads"
  );
};
