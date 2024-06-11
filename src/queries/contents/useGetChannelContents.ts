import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Content } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Contents
 */
export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  status?: string
) => {
  const keys = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (status) keys.push(status);
  return keys;
};

/**
 * @category Setters
 * @group Contents
 */
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

/**
 * @category Queries
 * @group Contents
 */
export const GetChannelContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  status,
  adminApiParams,
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
/**
 * @category Hooks
 * @group Contents
 */
export const useGetChannelContents = (
  channelId: string = "",
  status?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContents>>
  >(
    CHANNEL_CONTENTS_QUERY_KEY(channelId, status),
    (params: InfiniteQueryParams) =>
      GetChannelContents({
        channelId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && (options.enabled ?? true),
    }
  );
};
