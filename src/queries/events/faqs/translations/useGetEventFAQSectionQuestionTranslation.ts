import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQTranslation } from "@src/interfaces";
import { EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY } from "./useGetEventFAQSectionQuestionTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

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

export const SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventFAQSectionQuestionTranslation>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionQuestionTranslationProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  locale: string;
}

export const GetEventFAQSectionQuestionTranslation = async ({
  eventId,
  sectionId,
  questionId,
  locale,
  adminApiParams,
}: GetEventFAQSectionQuestionTranslationProps): Promise<
  ConnectedXMResponse<FAQTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations/${locale}`
  );
  return data;
};
export const useGetEventFAQSectionQuestionTranslation = (
  eventId: string = "",
  sectionId: string = "",
  questionId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFAQSectionQuestionTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventFAQSectionQuestionTranslation>
  >(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATION_QUERY_KEY(
      eventId,
      sectionId,
      questionId,
      locale
    ),
    (params) =>
      GetEventFAQSectionQuestionTranslation({
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
        (options?.enabled ?? true),
    }
  );
};
