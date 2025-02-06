import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPageTranslation } from "@src/interfaces";
import { EVENT_PAGE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPageTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation of a specific event page for a given locale.
 * This function is used to fetch the translated content of an event page, identified by event ID, page ID, and locale.
 * It is useful in applications that need to display event pages in different languages.
 * @name GetEventPageTranslation
 * @param {string} eventId (path) - The ID of the event
 * @param {string} pageId (path) - The ID of the page
 * @param {string} locale (path) - The locale for the translation
 * @version 1.3
 **/

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PAGE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  pageId: string,
  locale: string
) => [...EVENT_PAGE_TRANSLATIONS_QUERY_KEY(eventId, pageId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PAGE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PAGE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPageTranslation>>
) => {
  client.setQueryData(EVENT_PAGE_TRANSLATION_QUERY_KEY(...keyParams), response);
};

interface GetEventPageTranslationProps extends SingleQueryParams {
  eventId: string;
  pageId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPageTranslation = async ({
  eventId,
  pageId,
  locale,
  adminApiParams,
}: GetEventPageTranslationProps): Promise<
  ConnectedXMResponse<EventPageTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/pages/${pageId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPageTranslation = (
  eventId: string = "",
  pageId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPageTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPageTranslation>>(
    EVENT_PAGE_TRANSLATION_QUERY_KEY(eventId, pageId, locale),
    (params: SingleQueryParams) =>
      GetEventPageTranslation({
        eventId,
        pageId,
        locale,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!pageId && !!locale && locale !== "en",
    },
    "events"
  );
};