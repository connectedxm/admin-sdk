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
 * Endpoint to retrieve details of a specific guest within a channel's content.
 * This function allows users to fetch detailed information about a guest associated with a particular content in a channel.
 * It is designed for applications that require access to guest details for content management or display purposes.
 * @name GetChannelContentGuest
 * @param {string} channelId (path) The id of the channel
 * @param {string} contentId (path) The id of the content
 * @param {string} guestId (path) The id of the guest
 * @version 1.3
 **/

export const CHANNEL_CONTENT_GUEST_QUERY_KEY = (
  channelId: string,
  contentId: string,
  guestId: string
) => [...CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId), guestId];

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
}

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
