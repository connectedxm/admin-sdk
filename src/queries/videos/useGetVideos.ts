import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Video } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

import { useConnectedInfiniteQuery } from "../useConnectedInfiniteQuery";

export const VIDEOS_QUERY_KEY = (source: string) => ["VIDEOS", source];

export const SET_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof VIDEOS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetVideos>>
) => {
  client.setQueryData(VIDEOS_QUERY_KEY(...keyParams), response);
};

interface GetVideosParams extends InfiniteQueryParams {
  source: string;
}

export const GetVideos = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  source,
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

const useGetVideos = (source?: string) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetVideos>>(
    VIDEOS_QUERY_KEY(source || "all"),
    (params: any) => GetVideos({ ...params, source }),
    {}
  );
};

export default useGetVideos;
