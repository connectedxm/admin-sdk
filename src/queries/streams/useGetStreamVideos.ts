import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Video } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { STREAM_QUERY_KEY } from "./useGetStreamInput";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_VIDEOS_QUERY_KEY = (streamId: string) => [
  ...STREAM_QUERY_KEY(streamId),
  "VIDEOS",
];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_VIDEOS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamVideos>>
) => {
  client.setQueryData(STREAM_VIDEOS_QUERY_KEY(...keyParams), response);
};

interface GetStreamVideosProps extends InfiniteQueryParams {
  streamId: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamVideos = async ({
  streamId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetStreamVideosProps): Promise<ConnectedXMResponse<Video[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/${streamId}/videos`, {
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
export const useGetStreamVideos = (
  streamId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamVideos>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetStreamVideos>>>(
    STREAM_VIDEOS_QUERY_KEY(streamId),
    (params: InfiniteQueryParams) =>
      GetStreamVideos({
        ...params,
        streamId,
      }),
    params,
    {
      ...options,
      enabled: !!streamId && (options.enabled ?? true),
    },
    ["events", "storage"]
  );
};
