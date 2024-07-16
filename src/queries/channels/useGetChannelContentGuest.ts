import { GetAdminAPI } from "@src/AdminAPI";
import { BaseChannelContentGuest, ConnectedXMResponse } from "@src/interfaces";

import { QueryClient } from "@tanstack/react-query";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

/**
 * @category Keys
 * @group Channels
 */
export const CHANNEL_CONTENT_GUEST_QUERY_KEY = (
  channelId: string,
  contentId: string
) => [...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId), "GUESTS"];

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
  ConnectedXMResponse<BaseChannelContentGuest>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<
    ConnectedXMResponse<BaseChannelContentGuest>
  >(`/channels/${channelId}/contents/${contentId}/guests/${guestId}`);
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
    CHANNEL_CONTENT_GUEST_QUERY_KEY(channelId, contentId),
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
    }
  );
};
