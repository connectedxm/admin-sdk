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
export const EVENT_ROOM_QUERY_KEY = (eventId: string, roomId: string) => [
  ...EVENT_ROOMS_QUERY_KEY(eventId),
  roomId,
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
  roomId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoom = async ({
  eventId,
  roomId,
  adminApiParams,
}: GetRoomProps): Promise<ConnectedXMResponse<Room>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/rooms/${roomId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetRoom = (
  eventId: string = "",
  roomId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetRoom>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetRoom>>(
    EVENT_ROOM_QUERY_KEY(eventId, roomId),
    (params: SingleQueryParams) =>
      GetRoom({
        eventId,
        roomId: roomId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!roomId && (options?.enabled ?? true),
    }
  );
};
