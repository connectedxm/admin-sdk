import { GetAdminAPI } from "@src/AdminAPI";
import { ChannelContentGuest, ConnectedXMResponse } from "@src/interfaces";

import { QueryClient } from "@tanstack/react-query";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "./useGetChannelContentGuests";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_GUEST_QUERY_KEY = (
  channelId: string,
  contentId: string,
  guestId: string
) => [...CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId), guestId];

/**
 * @category Setters
 * @group Channels
 */
export const SET_CHANNEL_CONTENT_GUEST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENT_GUEST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentGuest>>
) => {
  client.setQueryData(CHANNEL_CONTENT_GUEST_QUERY_KEY(...keyParams), response);
};

interface GetChannelContentGuestsProps extends SingleQueryParams {
  channelId: string;
  contentId: string;
  guestId: string;
  status?: string;
}

/**
 * @category Queries
 * @group Channels
 */
export const GetChannelContentGuest = async ({
  channelId,
  contentId,
  guestId,
  adminApiParams,
}: GetChannelContentGuestsProps): Promise<
  ConnectedXMResponse<ChannelContentGuest>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<ChannelContentGuest>>(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Channels
 */
export const useGetChannelContentGuest = (
  channelId: string = "",
  contentId: string = "",
  guestId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetChannelContentGuest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelContentGuest>>(
    CHANNEL_CONTENT_GUEST_QUERY_KEY(channelId, contentId, guestId),
    (params: SingleQueryParams) =>
      GetChannelContentGuest({
        channelId,
        contentId,
        guestId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!channelId && !!contentId && !!guestId && (options.enabled ?? true),
    },
    "channels"
  );
};
