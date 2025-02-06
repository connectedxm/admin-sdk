import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassTypeTranslation } from "@src/interfaces";
import { EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPassTypeTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation for a specific event pass type based on the provided event ID, pass type ID, and locale.
 * This function is used to fetch localized translations for event pass types, which can be useful for displaying
 * event information in different languages. It is designed to be used in applications that require multilingual support
 * for event pass types.
 * @name GetEventPassTypeTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} passTypeId (path) - The ID of the pass type
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 */

export const EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  passTypeId: string,
  locale: string
) => [...EVENT_PASS_TYPE_TRANSLATIONS_QUERY_KEY(eventId, passTypeId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_TYPE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassTypeTranslation>>
) => {
  client.setQueryData(
    EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassTypeTranslationProps extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassTypeTranslation = async ({
  eventId,
  passTypeId,
  locale,
  adminApiParams,
}: GetEventPassTypeTranslationProps): Promise<
  ConnectedXMResponse<EventPassTypeTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassTypeTranslation = (
  eventId: string = "",
  passTypeId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassTypeTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassTypeTranslation>
  >(
    EVENT_PASS_TYPE_TRANSLATION_QUERY_KEY(eventId, passTypeId, locale),
    (params) =>
      GetEventPassTypeTranslation({
        ...params,
        eventId,
        passTypeId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!passTypeId && !!locale && locale !== "en",
    },
    "events"
  );
};