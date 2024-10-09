import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventReservationSectionLocationTranslation } from "@src/interfaces";
import { EVENT_RESERVATION_SECTION_LOCATION_TRANSLATIONS_QUERY_KEY } from "./useGetReservationSectionLocationTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
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

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetReservationSectionLocationTranslation>>
) => {
  client.setQueryData(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetReservationSectionLocationTranslationProps
  extends SingleQueryParams {
  eventId: string;
  reservationSectionId: string;
  locationId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetReservationSectionLocationTranslation = async ({
  eventId,
  reservationSectionId,
  locationId,
  locale,
  adminApiParams,
}: GetReservationSectionLocationTranslationProps): Promise<
  ConnectedXMResponse<EventReservationSectionLocationTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/reservationSections/${reservationSectionId}/locations/${locationId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetReservationSectionLocationTranslation = (
  eventId: string = "",
  reservationSectionId: string = "",
  locationId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetReservationSectionLocationTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetReservationSectionLocationTranslation>
  >(
    EVENT_RESERVATION_SECTION_LOCATION_TRANSLATION_QUERY_KEY(
      eventId,
      reservationSectionId,
      locationId,
      locale
    ),
    (params: SingleQueryParams) =>
      GetReservationSectionLocationTranslation({
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
        locale !== "en" &&
        (options.enabled ?? true),
    },
    "events"
  );
};
