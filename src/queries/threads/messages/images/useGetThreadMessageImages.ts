import { QueryClient, QueryKey, SetDataOptions } from "@tanstack/react-query";
import { Image } from "@interfaces";
import { ConnectedXMResponse } from "@interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { THREAD_MESSAGE_QUERY_KEY } from "../useGetThreadMessage";

export const THREAD_MESSAGE_IMAGES_QUERY_KEY = (
  threadId: string,
  messageId: string
): QueryKey => {
  return [...THREAD_MESSAGE_QUERY_KEY(threadId, messageId), "images"];
};

export const SET_THREAD_MESSAGE_IMAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MESSAGE_IMAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMessageImages>>,
  options?: SetDataOptions
) => {
  client.setQueryData(
    THREAD_MESSAGE_IMAGES_QUERY_KEY(...keyParams),
    response,
    options
  );
};

export interface GetThreadMessageImagesProps {
  threadId: string;
  messageId: string;
  pageParam: number;
  adminApiParams: any;
  pageSize?: number;
  orderBy?: string;
  search?: string;
  queryClient?: QueryClient;
}

export const GetThreadMessageImages = async ({
  threadId,
  messageId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetThreadMessageImagesProps): Promise<ConnectedXMResponse<Image[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/messages/${messageId}/images`,
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

export const useGetThreadMessageImages = (
  threadId: string,
  messageId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadMessageImages>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadMessageImages>>
  >(
    THREAD_MESSAGE_IMAGES_QUERY_KEY(threadId, messageId),
    (params: InfiniteQueryParams) =>
      GetThreadMessageImages({ threadId, messageId, ...params }),
    params,
    {
      ...options,
      enabled: !!threadId && !!messageId && (options?.enabled ?? true),
    }
  );
};
