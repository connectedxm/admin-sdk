import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventReservationSectionLocationTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

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
  response: Awaited<
    ReturnType<typeof GetEventReservationSectionLocationTranslation>
  >
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventReservationSectionLocationTranslationProps
  extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
}

export const GetEventReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  adminApiParams,
}: GetEventReservationSectionLocationTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`
  );
  return data;
};
export const useGetEventReservationSectionLocationTranslation = (
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventReservationSectionLocationTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventReservationSectionLocationTranslation>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetEventReservationSectionLocationTranslation({
        eventId,
        reservationSectionId,
        locationId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!reservationSectionId &&
        !!locationId &&
        !!locale &&
        (options.enabled ?? true),
    }
  );
};
