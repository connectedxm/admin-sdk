import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Room } from "@src/interfaces";
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
export const EVENT_ROOMS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ROOMS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOMS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRooms>>
) => {
  client.setQueryData(EVENT_ROOMS_QUERY_KEY(...keyParams), response);
};

interface GetRoomsProps extends InfiniteQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRooms = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetRoomsProps): Promise<ConnectedXMResponse<Room[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/rooms`, {
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
export const useGetRooms = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetRooms>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetRooms>>>(
    EVENT_ROOMS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetRooms({
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
