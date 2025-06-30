import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Thread } from "@src/interfaces";
import { STREAM_QUERY_KEY } from "./useGetStreamInput";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_THREADS_QUERY_KEY = (streamId: string) => [
  ...STREAM_QUERY_KEY(streamId),
  "THREADS",
];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_THREADS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_THREADS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamThreads>>
) => {
  client.setQueryData(STREAM_THREADS_QUERY_KEY(...keyParams), response);
};

interface GetStreamThreadsProps extends InfiniteQueryParams {
  streamId: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamThreads = async ({
  streamId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetStreamThreadsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/threads`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamThreads = (
  streamId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamThreads>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetStreamThreads>>
  >(
    STREAM_THREADS_QUERY_KEY(streamId),
    (params: InfiniteQueryParams) =>
      GetStreamThreads({
        ...params,
        streamId,
      }),
    params,
    {
      ...options,
      enabled: !!streamId && (options.enabled ?? true),
    },
    ["streams", "threads"]
  );
};
