import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Channel } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNELS_QUERY_KEY } from "./useGetChannels";

/**
 * @category Keys
 * @group Channels
 */
export const FEATURED_CHANNELS_QUERY_KEY = () => [
  CHANNELS_QUERY_KEY(),
  "FEATURED",
];

/**
 * @category Setters
 * @group Channels
 */
export const SET_FEATURED_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FEATURED_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedChannels>>
) => {
  client.setQueryData(FEATURED_CHANNELS_QUERY_KEY(...keyParams), response);
};

interface GetFeaturedChannelsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Channels
 */
export const GetFeaturedChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetFeaturedChannelsProps): Promise<ConnectedXMResponse<Channel[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/featured`, {
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
 * @group Channels
 */
export const useGetFeaturedChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetFeaturedChannels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetFeaturedChannels>>
  >(
    FEATURED_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetFeaturedChannels(params),
    params,
    options,
    "contents"
  );
};
