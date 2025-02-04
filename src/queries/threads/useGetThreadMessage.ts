import { QueryClient, QueryKey, SetDataOptions } from "@tanstack/react-query";
import { ThreadMessage } from "@interfaces";
import { ConnectedXMResponse } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { THREAD_MESSAGES_QUERY_KEY } from "./useGetThreadMessages";

export const THREAD_MESSAGE_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => {
  return [...THREAD_MESSAGES_QUERY_KEY(threadId, messageId)];
};

export const SET_THREAD_MESSAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessage>>,
  options?: SetDataOptions
) => {
  client.setQueryData(
    [...THREAD_MESSAGE_QUERY_KEY(...keyParams)],
    response,
    options
  );
};

export interface GetThreadMessageProps {
  threadId: string;
  messageId: string;
  adminApiParams?: any;
}

/**
 * @category Queries
 * @group Threads
 **/
export const GetThreadMessage = async ({
  threadId,
  messageId,
  adminApiParams,
}: GetThreadMessageProps): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/messages/${messageId}`
  );
  return data;
};

export const useGetThreadMessage = (
  threadId: string,
  messageId: string,
  options: SingleQueryOptions<ReturnType<typeof GetThreadMessage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadMessage>>(
    THREAD_MESSAGE_QUERY_KEY(threadId, messageId),
    (params) => GetThreadMessage({ threadId, messageId, ...params }),
    {
      staleTime: Infinity,
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    },
    "threads"
  );
};
