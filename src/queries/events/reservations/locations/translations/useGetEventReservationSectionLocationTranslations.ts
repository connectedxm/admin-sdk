import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
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
  response: Awaited<ReturnType<typeof GetEventReservationSectionTranslations>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
}

export const GetEventReservationSectionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  reservationSectionId,
  locationId,
}: GetEventReservationSectionTranslationsProps): Promise<
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

const useGetEventReservationSectionTranslations = (
  eventId: string,
  reservationSectionId: string,
  locationId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventReservationSectionTranslations>>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId
    ),
    (params: any) => GetEventReservationSectionTranslations(params),
    {
      eventId,
      reservationSectionId,
      locationId,
    },
    {
      enabled: !!eventId && !!reservationSectionId && !!locationId,
    }
  );
};

export default useGetEventReservationSectionTranslations;
