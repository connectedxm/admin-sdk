import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Room } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ROOMS_QUERY_KEY } from "./useGetRooms";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_QUERY_KEY = (eventId: string, roomName: string) => [
  ...EVENT_ROOMS_QUERY_KEY(eventId),
  roomName,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROOM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRoom>>
) => {
  client.setQueryData(EVENT_ROOM_QUERY_KEY(...keyParams), response);
};

interface GetRoomProps extends SingleQueryParams {
  eventId: string;
  roomName: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoom = async ({
  eventId,
  roomName,
  adminApiParams,
}: GetRoomProps): Promise<ConnectedXMResponse<Room>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/rooms/${roomName}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetRoom = (
  eventId: string = "",
  roomName: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetRoom>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetRoom>>(
    EVENT_ROOM_QUERY_KEY(eventId, roomName),
    (params: SingleQueryParams) =>
      GetRoom({
        eventId,
        roomName: roomName || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!roomName && (options?.enabled ?? true),
    }
  );
};
