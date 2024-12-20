import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_ROOM_TYPE_QUERY_KEY } from "../useGetEventRoomType";
import { EventRoomTypeTranslation } from "@src/interfaces";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  roomTypeId: string
) => [...EVENT_ROOM_TYPE_QUERY_KEY(eventId, roomTypeId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetRoomTypeTranslations>>
) => {
  client.setQueryData(
    EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetRoomTypeTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  roomTypeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetRoomTypeTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  roomTypeId,
  adminApiParams,
}: GetRoomTypeTranslationsProps): Promise<
  ConnectedXMResponse<EventRoomTypeTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/roomTypes/${roomTypeId}/translations`,
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
export const useGetRoomTypeTranslations = (
  eventId: string = "",
  roomTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetRoomTypeTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetRoomTypeTranslations>>
  >(
    EVENT_ROOM_TYPE_TRANSLATIONS_QUERY_KEY(eventId, roomTypeId),
    (params: InfiniteQueryParams) =>
      GetRoomTypeTranslations({
        ...params,
        eventId,
        roomTypeId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!roomTypeId && (options.enabled ?? true),
    },
    "events"
  );
};
