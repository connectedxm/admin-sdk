import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { ConnectedXMResponse, Livestream } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const LIVESTREAMS_QUERY_KEY = () => {
  return ["STREAMS_V2", "LIVESTREAMS"];
};

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_LIVESTREAMS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LIVESTREAMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLivestreams>>
) => {
  client.setQueryData(LIVESTREAMS_QUERY_KEY(...keyParams), response);
};

interface GetLivestreamsParams extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetLivestreams = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetLivestreamsParams): Promise<ConnectedXMResponse<Livestream[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/livestreams`, {
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
 * @group StreamsV2
 */
export const useGetLivestreams = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLivestreams>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLivestreams>>>(
    LIVESTREAMS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetLivestreams(params),
    params,
    options
  );
};
