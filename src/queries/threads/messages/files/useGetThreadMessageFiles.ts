import { QueryClient, QueryKey, SetDataOptions } from "@tanstack/react-query";
import { File } from "@interfaces";
import { ConnectedXMResponse } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { THREAD_MESSAGE_QUERY_KEY } from "../useGetThreadMessage";

export const THREAD_MESSAGE_FILES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => {
  return [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "files"];
};

export const SET_THREAD_MESSAGE_FILES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_FILES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessageFiles>>,
  options?: SetDataOptions
) => {
  client.setQueryData(
    THREAD_MESSAGE_FILES_QUERY_KEY(...keyParams),
    response,
    options
  );
};

export interface GetThreadMessageFilesProps {
  threadId: string;
  messageId: string;
  pageParam: number;
  adminApiParams: any;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  queryClient?: QueryClient;
}

export const GetThreadMessageFiles = async ({
  threadId,
  messageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadMessageFilesProps): Promise<ConnectedXMResponse<File[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/messages/${messageId}/files`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetThreadMessageFiles = (
  threadId: string,
  messageId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessageFiles>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageFiles>>
  >(
    THREAD_MESSAGE_FILES_QUERY_KEY(threadId, messageId),
    (params: InfiniteQueryParams) =>
      GetThreadMessageFiles({ threadId, messageId, ...params }),
    params,
    {
      ...options,
      enabled: !!threadId && !!messageId && (options?.enabled ?? true),
    }
  );
};
