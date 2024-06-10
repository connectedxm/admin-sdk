import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventReservationSectionLocationTranslations";

export const EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  reservationSectionId: string,
  locationId: string,
  locale: string
) => [
  ...EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY(
    eventId,
    reservationSectionId,
    locationId
  ),
  locale,
];

export const SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventReservationSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionTranslationProps {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
}

export const GetEventReservationSectionTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
}: GetEventReservationSectionTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`
  );
  return data;
};

const useGetEventReservationSectionTranslation = (
  eventId: string,
  reservationSectionId: string,
  locationId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventReservationSectionTranslation>>((
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId,
      locale
    ),
    () =>
      GetEventReservationSectionTranslation({
        eventId,
        reservationSectionId,
        locationId,
        locale,
      }),
    {
      enabled: !!eventId && !!reservationSectionId && !!locationId && !!locale,
    }
  );
};

export default useGetEventReservationSectionTranslation;
