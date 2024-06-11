import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../../useConnectedInfiniteQuery";
import { EVENT_RESERVATION_SECTION_LOCATION_QUERY_KEY } from "../useGetEventReservationSectionLocation";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";

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

export const SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventReservationSectionLocationTranslations>
  >
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionLocationTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

export const GetEventReservationSectionLocationTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  reservationSectionId,
  locationId,
  adminApiParams,
}: GetEventReservationSectionLocationTranslationsProps): Promise<
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
export const useGetEventReservationSectionLocationTranslations = (
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventReservationSectionLocationTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSectionLocationTranslations>>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    (params: InfiniteQueryParams) =>
      GetEventReservationSectionLocationTranslations({
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
    }
  );
};
