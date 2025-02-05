import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  EventSessionLocationTranslation,
} from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY } from "./useGetEventSessionTranslations";

/**
 * Retrieves the translation details for a specific event session location based on the provided event ID, location ID, and locale.
 * This function is used to fetch localized information for event session locations, which is essential for applications that support multiple languages.
 * It is designed to be used in scenarios where translation data for event session locations is required.
 * @name GetEventSessionLocationTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} locationId - The ID of the location
 * @param {string} locale - The locale for the translation
 * @version 1.2
 */

export const EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  locationId: string,
  locale: string
) => [
  ...EVENT_SESSION_LOCATION_TRANSLATIONS_QUERY_KEY(eventId, locationId),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_LOCATION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionLocationTranslation>>
) => {
  client.setQueryData(
    EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionLocationTranslationProps extends SingleQueryParams {
  eventId: string;
  locationId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionLocationTranslation = async ({
  eventId,
  locationId,
  locale,
  adminApiParams,
}: GetEventSessionLocationTranslationProps): Promise<
  ConnectedXMResponse<EventSessionLocationTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionLocations/${locationId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionLocationTranslation = (
  eventId: string = "",
  locationId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionLocationTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionLocationTranslation>
  >(
    EVENT_SESSION_LOCATION_TRANSLATION_QUERY_KEY(eventId, locationId, locale),
    (params) =>
      GetEventSessionLocationTranslation({
        ...params,
        eventId,
        locationId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!locale && locale !== "en",
    },
    "events"
  );
};