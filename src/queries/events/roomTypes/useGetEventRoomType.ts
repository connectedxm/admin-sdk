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
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_TYPE_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPES_QUERY_KEY(eventId), roomTypeId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRoomType>>
) => {
  client.setQueryData(EVENT_ROOM_TYPE_QUERY_KEY(...keyParams), response);
};

interface GetRoomTypeProps extends SingleQueryParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoomType = async ({
  eventId,
  roomTypeId,
  adminApiParams,
}: GetRoomTypeProps): Promise<ConnectedXMResponse<EventRoomType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetRoomType = (
  eventId: string = "",
  roomTypeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetRoomType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetRoomType>>(
    EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
    (params: SingleQueryParams) =>
      GetRoomType({
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
