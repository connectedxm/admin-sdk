import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { ChannelContent } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  featured?: boolean
) => {
  const keys = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (typeof featured === "boolean")
    keys.push(featured ? "FEATURED" : "NOT FEATURED");
  return keys;
};

/**
 * @category Setters
 * @group Channels
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
  featured?: boolean;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  featured,
  adminApiParams,
}: GetChannelContentsProps): Promise<ConnectedXMResponse<ChannelContent[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/channels/${channelId}/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      featured,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContents = (
  channelId: string = "",
  featured?: boolean,
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
    CHANNEL_CONTENTS_QUERY_KEY(channelId, featured),
    (params: InfiniteQueryParams) =>
      GetChannelContents({
        channelId,
        featured,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && (options.enabled ?? true),
    },
    "channels"
  );
};
