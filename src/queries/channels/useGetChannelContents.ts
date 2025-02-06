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
 * Fetches the contents of a specific channel, with an optional filter for featured content.
 * This function is designed to retrieve a list of contents associated with a given channel ID.
 * It supports infinite scrolling and can be used in applications where channel content needs to be displayed.
 * @name GetChannelContents
 * @param {string} channelId (path) The id of the channel
 * @param {boolean} [featured] (query) Optional flag to filter featured contents
 * @version 1.3
 **/

export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  featured?: boolean
) => {
  const keys = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (typeof featured === "boolean")
    keys.push(featured ? "FEATURED" : "NOT FEATURED");
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
  featured?: boolean;
}

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
