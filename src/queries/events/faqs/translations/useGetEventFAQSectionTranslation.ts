import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTranslation, FAQSectionTranslation } from "@src/interfaces";
import { EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventFAQSectionTranslations";

export const EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  locale: string
) => [...EVENT_FAQ_SECTION_TRANSLATIONS_QUERY_KEY(eventId, sectionId), locale];

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

interface GetEventFAQSectionTranslationProps {
  eventId: string;
  sectionId: string;
  locale: string;
}

export const GetEventFAQSectionTranslation = async ({
  eventId,
  sectionId,
  locale,
}: GetEventFAQSectionTranslationProps): Promise<
  ConnectedXMResponse<FAQSectionTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/translations/${locale}`
  );
  return data;
};

const useGetEventFAQSectionTranslation = (
  eventId: string,
  sectionId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSectionTranslation>>((
    EVENT_FAQ_SECTION_TRANSLATION_QUERY_KEY(eventId, sectionId, locale),
    () =>
      GetEventFAQSectionTranslation({
        eventId,
        sectionId,
        locale,
      }),
    {
      enabled: !!eventId && !!sectionId && !!locale,
    }
  );
};

export default useGetEventFAQSectionTranslation;
