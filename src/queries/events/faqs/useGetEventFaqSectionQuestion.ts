import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "./useGetEventFaqSectionQuestions";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_FAQ_SECTION_QUESTION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
) => [...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId), questionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSectionQuestion>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFaqSectionQuestionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventFaqSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  adminApiParams,
}: GetEventFaqSectionQuestionProps): Promise<ConnectedXMResponse<Faq>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventFaqSectionQuestion = (
  eventId: string = "",
  sectionId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventFaqSectionQuestion>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFaqSectionQuestion>>(
    EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId),
    (params: SingleQueryParams) =>
      GetEventFaqSectionQuestion({
        eventId: eventId,
        sectionId: sectionId,
        questionId: questionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sectionId && !!questionId && (options?.enabled ?? true),
    }
  );
};
