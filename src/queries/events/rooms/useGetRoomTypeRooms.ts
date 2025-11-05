import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Room } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ROOM_TYPE_QUERY_KEY } from "../roomTypes/useGetEventRoomType";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_TYPE_ROOMS_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId), "ROOMS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_ROOMS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_ROOMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRoomTypeRooms>>
) => {
  client.setQueryData(EVENT_ROOM_TYPE_ROOMS_QUERY_KEY(...keyParams), response);
};

interface GetRoomTypeRoomsProps extends InfiniteQueryParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoomTypeRooms = async ({
  eventId,
  roomTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetRoomTypeRoomsProps): Promise<ConnectedXMResponse<Room[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/rooms`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetRoomTypeRooms = (
  eventId: string = "",
  roomTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetRoomTypeRooms>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetRoomTypeRooms>>
  >(
    EVENT_ROOM_TYPE_ROOMS_QUERY_KEY(eventId, roomTypeId),
    (params: InfiniteQueryParams) =>
      GetRoomTypeRooms({
        ...params,
        eventId,
        roomTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!roomTypeId && (options.enabled ?? true),
    }
  );
};
