import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY } from "../useGetReservationSectionLocation";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => [
  ...EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY(
    eventId,
    reservationSectionId,
    locationId
  ),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetReservationSectionLocationTranslations>
  >
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionLocationTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSectionLocationTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  reservationSectionId,
  locationId,
  adminApiParams,
}: GetReservationSectionLocationTranslationsProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations`,
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
export const useGetReservationSectionLocationTranslations = (
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetReservationSectionLocationTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetReservationSectionLocationTranslations>>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    (params: InfiniteQueryParams) =>
      GetReservationSectionLocationTranslations({
        ...params,
        eventId,
        reservationSectionId,
        locationId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!reservationSectionId &&
        !!locationId &&
        (options.enabled ?? true),
    },
    "events"
  );
};
