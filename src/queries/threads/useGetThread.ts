import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Thread } from "@src/interfaces";
import { THREADS_QUERY_KEY } from "./useGetThreads";
import { QueryClient, SetDataOptions, Updater } from "@tanstack/react-query";

/**
 * Endpoint to fetch a specific thread by its ID.
 * This function allows users to retrieve detailed information about a particular thread using its unique identifier.
 * It is designed for applications that require access to thread data for display or processing purposes.
 * @name GetThread
 * @param {string} threadId - The ID of the thread
 * @version 1.2
 **/

export const THREAD_QUERY_KEY = (threadId: string, messageId?: string) => [
  ...THREADS_QUERY_KEY(),
  threadId,
  messageId,
];

export const SET_THREAD_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThread>>>,
  options?: SetDataOptions
) => {
  client.setQueryData([...THREAD_QUERY_KEY(...keyParams)], response, options);
};

interface GetThreadProps extends SingleQueryParams {
  threadId: string;
}

export const GetThread = async ({
  threadId,
  adminApiParams,
}: GetThreadProps): Promise<ConnectedXMResponse<Thread>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/threads/${threadId}`);
  return data;
};

export const useGetThread = (
  threadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThread>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThread>>(
    THREAD_QUERY_KEY(threadId),
    (params: SingleQueryParams) => GetThread({ threadId, ...params }),
    {
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    },
    "threads"
  );
};