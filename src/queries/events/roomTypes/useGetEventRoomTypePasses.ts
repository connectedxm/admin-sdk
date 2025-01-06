import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
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
export const EVENT_ROOM_TYPE_PASSES_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_PASSES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoomTypePasses>>
) => {
  client.setQueryData(EVENT_ROOM_TYPE_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventRoomTypePassesProps extends InfiniteQueryParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoomTypePasses = async ({
  eventId,
  roomTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoomTypePassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/passes`,
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
export const useGetEventRoomTypePasses = (
  eventId: string = "",
  roomTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoomTypePasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoomTypePasses>>
  >(
    EVENT_ROOM_TYPE_PASSES_QUERY_KEY(eventId, roomTypeId),
    (params: InfiniteQueryParams) =>
      GetEventRoomTypePasses({
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
