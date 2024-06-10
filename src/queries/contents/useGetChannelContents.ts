import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Content } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  status?: string
) => {
  let keys = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (status) keys.push(status);
  return keys;
};

export const SET_CHANNEL_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContents>>
) => {
  client.setQueryData(CHANNEL_CONTENTS_QUERY_KEY(...keyParams), response);
};

interface GetChannelContentsProps extends InfiniteQueryParams {
  channelId: string;
  status?: string;
}

export const GetChannelContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  status,
}: GetChannelContentsProps): Promise<ConnectedXMResponse<Content[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};

const useGetChannelContents = (channelId: string, status?: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContents>>
  >(
    CHANNEL_CONTENTS_QUERY_KEY(channelId, status),
    (params: any) => GetChannelContents(params),
    {
      channelId,
      status,
    },
    {
      enabled: !!channelId,
    }
  );
};

export default useGetChannelContents;
