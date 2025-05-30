import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Video } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Videos
 */
export const VIDEOS_QUERY_KEY = (source?: string) => {
  const keys = ["VIDEOS"];
  if (source) keys.push(source);
  return keys;
};

/**
 * @category Setters
 * @group Videos
 */
export const SET_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEOS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideos>>
) => {
  client.setQueryData(VIDEOS_QUERY_KEY(...keyParams), response);
};

interface GetVideosParams extends InfiniteQueryParams {
  source?: string;
}

/**
 * @category Queries
 * @group Videos
 */
export const GetVideos = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  source,
  adminApiParams,
}: GetVideosParams): Promise<ConnectedXMResponse<Video[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/videos`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      source: source || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @group Videos
 */
export const useGetVideos = (
  source?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetVideos>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetVideos>>>(
    VIDEOS_QUERY_KEY(source || "all"),
    (params: InfiniteQueryParams) => GetVideos({ ...params, source }),
    params,
    options,
    "storage"
  );
};
