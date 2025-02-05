import { GetAdminAPI } from "@src/AdminAPI";
import { ChannelContentGuest, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";

/**
 * Endpoint to fetch guests for a specific channel content.
 * This function retrieves a list of guests associated with a particular channel content,
 * allowing users to manage or view guest information based on the channel and content identifiers.
 * @name GetChannelContentGuests
 * @param {string} channelId - The id of the channel
 * @param {string} contentId - The id of the content
 * @param {string} [status] - Optional status of the guests
 * @version 1.2
 **/

export const CHANNEL_CONTENT_GUESTS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "GUESTS"];

export const SET_CHANNEL_CONTENT_GUESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_GUESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentGuests>>
) => {
  client.setQueryData(CHANNEL_CONTENT_GUESTS_QUERY_KEY(...keyParams), response);
};

interface GetChannelContentGuestsProps extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
  status?: string;
}

export const GetChannelContentGuests = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetChannelContentGuestsProps): Promise<
  ConnectedXMResponse<ChannelContentGuest[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<ChannelContentGuest[]>
  >(`/channels/${channelId}/contents/${contentId}/guests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetChannelContentGuests = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentGuests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentGuests>>
  >(
    CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentGuests({
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