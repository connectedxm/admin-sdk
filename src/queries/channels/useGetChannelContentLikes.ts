import { ChannelContentLike, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches the likes for a specific piece of content within a channel.
 * This function supports pagination and filtering, allowing users to retrieve likes data efficiently.
 * It is designed to be used in applications where understanding user engagement with channel content is necessary.
 * @name GetChannelContentLikes
 * @param {string} channelId (path) The id of the channel
 * @param {string} contentId (path) The id of the content
 * @version 1.3
 **/

export const CHANNEL_CONTENT_LIKES_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "LIKES"];

export const SET_CHANNEL_CONTENT_LIKES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_LIKES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentLikes>>
) => {
  client.setQueryData(CHANNEL_CONTENT_LIKES_QUERY_KEY(...keyParams), response);
};

interface GetContentLikesProps extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetChannelContentLikes = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetContentLikesProps): Promise<
  ConnectedXMResponse<ChannelContentLike[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/contents/${contentId}/likes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetChannelContentLikes = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentLikes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentLikes>>
  >(
    CHANNEL_CONTENT_LIKES_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentLikes({
        channelId,
        contentId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options.enabled ?? true),
    },
    "channels"
  );
};
