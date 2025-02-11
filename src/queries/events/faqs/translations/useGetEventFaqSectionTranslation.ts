import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqSectionTranslation } from "@src/interfaces";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventFaqSectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation of a specific FAQ section for an event in a given locale.
 * This function is used to fetch the translated content of an FAQ section associated with an event,
 * allowing applications to display localized information to users.
 * @name GetEventFaqSectionTranslation
 * @param {string} eventId (path) The ID of the event
 * @param {string} sectionId (path) The ID of the FAQ section
 * @param {string} locale (path) The locale for the translation
 * @version 1.3
 **/

export const EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  locale: string
) => [...EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFaqSectionTranslationProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
}: GetEventFaqSectionTranslationProps): Promise<
  ConnectedXMResponse<FaqSectionTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFaqSectionTranslation = (
  eventId: string = "",
  sectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFaqSectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventFaqSectionTranslation>
  >(
    EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    (params) =>
      GetEventFaqSectionTranslation({
        ...params,
        eventId,
        sectionId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sectionId &&
        !!locale &&
        locale !== "en" &&
        (options.enabled ?? true),
    },
    "events"
  );
};
