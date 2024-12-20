import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
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
export const EVENT_ROOM_TYPE_TIERS_QUERY_KEY = (
  allowed: boolean,
  eventId: string,
  roomTypeId: string
) => [
  ...EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId),
  "TIERS",
  allowed ? "ALLOWED" : "DISALLOWED",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRoomTypeTiers>>
) => {
  client.setQueryData(EVENT_ROOM_TYPE_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetRoomTypeTiersProps extends InfiniteQueryParams {
  allowed: boolean;
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoomTypeTiers = async ({
  allowed,
  eventId,
  roomTypeId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetRoomTypeTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/tiers`,
    {
      params: {
        allowed,
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
export const useGetRoomTypeTiers = (
  allowed: boolean,
  eventId: string = "",
  roomTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetRoomTypeTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetRoomTypeTiers>>
  >(
    EVENT_ROOM_TYPE_TIERS_QUERY_KEY(allowed, eventId, roomTypeId),
    (params: InfiniteQueryParams) =>
      GetRoomTypeTiers({
        ...params,
        allowed,
        eventId,
        roomTypeId,
      }),
    params,
    {
      ...options,
      enabled:
        typeof allowed === "boolean" &&
        !!eventId &&
        !!roomTypeId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
