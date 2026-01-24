import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, VideoCaption } from "@src/interfaces";
import { VIDEO_QUERY_KEY } from "../useGetVideo";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Videos
 */
export const VIDEO_CAPTIONS_QUERY_KEY = (videoId: string) => [
  ...VIDEO_QUERY_KEY(videoId),
  "CAPTIONS",
];

/**
 * @category Setters
 * @group Videos
 */
export const SET_VIDEO_CAPTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEO_CAPTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideoCaptions>>
) => {
  client.setQueryData(VIDEO_CAPTIONS_QUERY_KEY(...keyParams), response);
};

interface GetVideoCaptionsParams extends InfiniteQueryParams {
  videoId: string;
}

/**
 * @category Queries
 * @group Videos
 */
export const GetVideoCaptions = async ({
  videoId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetVideoCaptionsParams): Promise<ConnectedXMResponse<VideoCaption[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/videos/${videoId}/captions`, {
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
 * @group Videos
 */
export const useGetVideoCaptions = (
  videoId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetVideoCaptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetVideoCaptions>>
  >(
    VIDEO_CAPTIONS_QUERY_KEY(videoId),
    (params: InfiniteQueryParams) => GetVideoCaptions({ videoId, ...params }),
    params,
    {
      ...options,
      enabled: !!videoId && (options?.enabled ?? true),
    }
  );
};
