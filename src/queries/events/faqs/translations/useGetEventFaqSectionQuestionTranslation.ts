import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqTranslation } from "@src/interfaces";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventFaqSectionQuestionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves the translation of a specific FAQ question within an event section for a given locale.
 * This function is used to fetch the translated content of a FAQ question, which is part of an event's FAQ section.
 * It is designed to support multilingual applications by providing localized content for event-related FAQs.
 * @name GetEventFaqSectionQuestionTranslation
 * @param {string} eventId - The ID of the event
 * @param {string} sectionId - The ID of the FAQ section
 * @param {string} questionId - The ID of the FAQ question
 * @param {string} locale - The locale for the translation
 * @version 1.2
 */

export const EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string,
  locale: string
) => [
  ...EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
    eventId,
    sectionId,
    questionId
  ),
  locale,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventFaqSectionQuestionTranslation>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFaqSectionQuestionTranslationProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  adminApiParams,
}: GetEventFaqSectionQuestionTranslationProps): Promise<
  ConnectedXMResponse<FaqTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFaqSectionQuestionTranslation = (
  eventId: string = "",
  sectionId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFaqSectionQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventFaqSectionQuestionTranslation>
  >(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(
      eventId,
      sectionId,
      questionId,
      locale
    ),
    (params) =>
      GetEventFaqSectionQuestionTranslation({
        ...params,
        eventId,
        sectionId,
        questionId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sectionId &&
        !!questionId &&
        !!locale &&
        locale !== "en" &&
        (options?.enabled ?? true),
    },
    "events"
  );
};