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
 * Retrieves a list of featured channels from the server.
 * This function is designed to fetch and return a paginated list of channels that are marked as featured.
 * It is useful for applications that need to display a curated list of channels to users.
 * @name GetFeaturedChannels
 * @version 1.2
 **/

export const FEATURED_CHANNELS_QUERY_KEY = () => [
  CHANNELS_QUERY_KEY(),
  "FEATURED",
];

export const SET_FEATURED_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof FEATURED_CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedChannels>>
) => {
  client.setQueryData(FEATURED_CHANNELS_QUERY_KEY(...keyParams), response);
};

interface GetFeaturedChannelsProps extends InfiniteQueryParams {}

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
    "channels"
  );
};