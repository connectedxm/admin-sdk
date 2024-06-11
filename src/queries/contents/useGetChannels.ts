import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Channel } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Contents
 */
export const CHANNELS_QUERY_KEY = () => ["CHANNELS"];

/**
 * @category Setters
 * @group Contents
 */
export const SET_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannels>>
) => {
  client.setQueryData(CHANNELS_QUERY_KEY(...keyParams), response);
};

interface GetChannelsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Contents
 */
export const GetChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetChannelsProps): Promise<ConnectedXMResponse<Channel[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels`, {
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
 * @group Contents
 */
export const useGetChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetChannels>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetChannels>>>(
    CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetChannels(params),
    params,
    options
  );
};
