import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventMediaItem } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_MEDIA_ITEMS_QUERY_KEY } from "./useGetEventMediaItems";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MEDIA_ITEM_QUERY_KEY = (eventId: string, itemId: string) => [
  ...EVENT_MEDIA_ITEMS_QUERY_KEY(eventId),
  itemId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MEDIA_ITEM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItem>>
) => {
  client.setQueryData(EVENT_MEDIA_ITEM_QUERY_KEY(...keyParams), response);
};

interface GetEventMediaItemProps extends SingleQueryParams {
  eventId: string;
  itemId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMediaItem = async ({
  eventId,
  itemId,
  adminApiParams,
}: GetEventMediaItemProps): Promise<ConnectedXMResponse<EventMediaItem>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/media/${itemId}`);
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventMediaItem = (
  eventId: string = "",
  itemId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventMediaItem>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventMediaItem>>(
    EVENT_MEDIA_ITEM_QUERY_KEY(eventId, itemId),
    (params: SingleQueryParams) =>
      GetEventMediaItem({ eventId, itemId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!itemId && (options?.enabled ?? true),
    }
  );
};
