import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomTypeReservation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ROOM_TYPE_QUERY_KEY } from "./useGetEventRoomType";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_TYPE_RESERVATIONS_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId), "RESERVATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_RESERVATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_RESERVATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoomTypeReservations>>
) => {
  client.setQueryData(
    EVENT_ROOM_TYPE_RESERVATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRoomTypeReservationsProps extends InfiniteQueryParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoomTypeReservations = async ({
  eventId,
  roomTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoomTypeReservationsProps): Promise<
  ConnectedXMResponse<EventRoomTypeReservation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/reservations`,
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
export const useGetEventRoomTypeReservations = (
  eventId: string = "",
  roomTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoomTypeReservations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoomTypeReservations>>
  >(
    EVENT_ROOM_TYPE_RESERVATIONS_QUERY_KEY(eventId, roomTypeId),
    (params: InfiniteQueryParams) =>
      GetEventRoomTypeReservations({
        ...params,
        eventId,
        roomTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!roomTypeId && (options.enabled ?? true),
    },
    "events"
  );
};
