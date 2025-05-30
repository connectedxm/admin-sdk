import { QueryClient, QueryKey, SetDataOptions } from "@tanstack/react-query";
import { Video } from "@interfaces";
import { ConnectedXMResponse } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { THREAD_MESSAGE_QUERY_KEY } from "./useGetThreadMessage";

export const THREAD_MESSAGE_VIDEOS_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => {
  return [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "videos"];
};

export const SET_THREAD_MESSAGE_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_VIDEOS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessageVideos>>,
  options?: SetDataOptions
) => {
  client.setQueryData(
    THREAD_MESSAGE_VIDEOS_QUERY_KEY(...keyParams),
    response,
    options
  );
};

export interface GetThreadMessageVideosProps {
  threadId: string;
  messageId: string;
  pageParam: number;
  adminApiParams: any;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  queryClient?: QueryClient;
}

export const GetThreadMessageVideos = async ({
  threadId,
  messageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadMessageVideosProps): Promise<ConnectedXMResponse<Video[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/messages/${messageId}/videos`,
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

export const useGetThreadMessageVideos = (
  threadId: string,
  messageId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessageVideos>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageVideos>>
  >(
    THREAD_MESSAGE_VIDEOS_QUERY_KEY(threadId, messageId),
    (params: InfiniteQueryParams) =>
      GetThreadMessageVideos({ threadId, messageId, ...params }),
    params,
    {
      ...options,
      enabled: !!threadId && !!messageId && (options?.enabled ?? true),
    }
  );
};
