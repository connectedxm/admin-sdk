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
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_GUESTS_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "GUESTS"];

/**
 * @category Setters
 * @group Channels
 */
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

/**
 * @category Queries
 * @group Channels
 */
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
/**
 * @category Hooks
 * @group Channels
 */
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
    "contents"
  );
};
