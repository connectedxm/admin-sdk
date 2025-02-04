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
 * Endpoint to retrieve video data with optional filtering by source.
 * This function supports pagination, ordering, and search functionalities, allowing users to efficiently query video data.
 * It is designed for applications that require dynamic video content retrieval with flexible query parameters.
 * @name GetVideos
 * @param {string} [source] - The source of the videos
 * @version 1.2
 **/

export const VIDEOS_QUERY_KEY = (source?: string) => {
  const keys = ["VIDEOS"];
  if (source) keys.push(source);
  return keys;
};

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