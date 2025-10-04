import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventRoomType } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_TYPES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ROOM_TYPES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoomTypes>>
) => {
  client.setQueryData(EVENT_ROOM_TYPES_QUERY_KEY(...keyParams), response);
};

interface GetEventRoomTypesProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoomTypes = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRoomTypesProps): Promise<ConnectedXMResponse<EventRoomType[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/roomTypes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRoomTypes = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRoomTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRoomTypes>>
  >(
    EVENT_ROOM_TYPES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventRoomTypes({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
