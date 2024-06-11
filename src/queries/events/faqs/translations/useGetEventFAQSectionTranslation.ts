import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQSectionTranslation } from "@src/interfaces";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventFAQSectionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
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
  response: Awaited<ReturnType<typeof GetEventFAQSectionTranslation>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionTranslationProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
  adminApiParams,
}: GetEventFAQSectionTranslationProps): Promise<
  ConnectedXMResponse<FAQSectionTranslation>
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
export const useGetEventFAQSectionTranslation = (
  eventId: string = "",
  sectionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFAQSectionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventFAQSectionTranslation>
  >(
    EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    (params) =>
      GetEventFAQSectionTranslation({
        ...params,
        eventId,
        sectionId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sectionId && !!locale && (options.enabled ?? true),
    }
  );
};
