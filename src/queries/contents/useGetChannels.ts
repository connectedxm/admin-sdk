import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Channel } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const CHANNELS_QUERY_KEY = () => ["CHANNELS"];

export const SET_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannels>>
) => {
  client.setQueryData(CHANNELS_QUERY_KEY(...keyParams), response);
};

interface GetChannelsProps extends InfiniteQueryParams {}

export const GetChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetChannels = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetChannels>>>(
    CHANNELS_QUERY_KEY(),
    (params: any) => GetChannels(params),
    {},
    {}
  );
};

export default useGetChannels;
