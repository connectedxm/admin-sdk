import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_QUERY_KEY } from "../useGetReservationSection";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string
) => [
  ...EVENT_RESERVATION_SECTION_QUERY_KEY(eventId, reservationSectionId),
  "RESERVATION_SECTION_LOCATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReservationSectionLocations>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionsProps extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSectionLocations = async ({
  eventId,
  reservationSectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetReservationSectionsProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations`,
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
export const useGetReservationSectionLocations = (
  eventId: string = "",
  reservationSectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetReservationSectionLocations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetReservationSectionLocations>>
  >(
    EVENT_RESERVATION_SECTION_LOCATIONS_QUERY_KEY(
      eventId,
      reservationSectionId
    ),
    (params: InfiniteQueryParams) =>
      GetReservationSectionLocations({
        ...params,
        eventId,
        reservationSectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!reservationSectionId && (options.enabled ?? true),
    },
    "events"
  );
};
