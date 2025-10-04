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
 * @category Keys
 * @group Events
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
    }
  );
};
