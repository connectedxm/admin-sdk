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
 * This file contains functions for fetching and managing thread data.
 * It provides an endpoint to retrieve a specific thread by its ID and 
 * utilizes connected single queries to retrieve data about threads.
 * The functions in this file are designed to be used in applications 
 * that require access to thread data for display or processing purposes.
 * @name Thread Management
 * @param {string} threadId (path) The ID of the thread
 * @version 1.3
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