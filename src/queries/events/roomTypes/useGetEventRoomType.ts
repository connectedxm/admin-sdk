import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ROOM_TYPES_QUERY_KEY } from "./useGetEventRoomTypes";

/**
 * Retrieves data for a specific event room type by its ID within a given event.
 * This function is used to fetch detailed information about a particular room type associated with an event.
 * It is designed for applications that require access to event room type details.
 * @name GetEventRoomType
 * @param {string} eventId - The ID of the event
 * @param {string} roomTypeId - The ID of the room type
 * @version 1.2
 **/

export const EVENT_ROOM_TYPE_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPES_QUERY_KEY(eventId), roomTypeId];

export const SET_EVENT_ROOM_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoomType>>
) => {
  client.setQueryData(EVENT_ROOM_TYPE_QUERY_KEY(...keyParams), response);
};

interface GetEventRoomTypeProps extends SingleQueryParams {
  eventId: string;
  roomTypeId: string;
}

export const GetEventRoomType = async ({
  eventId,
  roomTypeId,
  adminApiParams,
}: GetEventRoomTypeProps): Promise<ConnectedXMResponse<EventRoomType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}`
  );
  return data;
};

export const useGetEventRoomType = (
  eventId: string = "",
  roomTypeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRoomType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRoomType>>(
    EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
    (params: SingleQueryParams) =>
      GetEventRoomType({
        eventId,
        roomTypeId: roomTypeId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!roomTypeId,
    },
    "events"
  );
};