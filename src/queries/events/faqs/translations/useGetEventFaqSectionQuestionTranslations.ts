import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { FaqTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_FAQ_SECTION_QUESTION_QUERY_KEY } from "../useGetEventFaqSectionQuestion";

/**
 * Retrieves translations for a specific FAQ question within an event section.
 * This function is used to fetch all available translations for a given FAQ question, identified by event, section, and question IDs.
 * It is designed to support applications that require multilingual support for event-related FAQs.
 * @name GetEventFaqSectionQuestionTranslations
 * @param {string} eventId (path) - The ID of the event
 * @param {string} sectionId (path) - The ID of the section within the event
 * @param {string} questionId (path) - The ID of the question within the section
 * @version 1.3
 **/

export const EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
) => [
  ...EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<
    typeof EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventFaqSectionQuestionTranslations>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFaqSectionQuestionTranslationsProps
  extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSectionQuestionTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  sectionId,
  questionId,
  adminApiParams,
}: GetEventFaqSectionQuestionTranslationsProps): Promise<
  ConnectedXMResponse<FaqTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}/translations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFaqSectionQuestionTranslations = (
  eventId: string = "",
  sectionId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFaqSectionQuestionTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSectionQuestionTranslations>>
  >(
    EVENT_FAQ_SECTION_QUESTION_TRANSLATIONS_QUERY_KEY(
      eventId,
      sectionId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventFaqSectionQuestionTranslations({
        ...params,
        eventId,
        sectionId,
        questionId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sectionId && !!questionId && (options.enabled ?? true),
    },
    "events"
  );
};