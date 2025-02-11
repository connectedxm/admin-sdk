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
 * Retrieves a specific FAQ question from a designated section within an event.
 * This function is designed to fetch detailed information about a particular FAQ question,
 * identified by its unique question ID, within a specified section of an event.
 * It is useful for applications that need to display or process information about individual FAQ questions.
 * @name GetEventFaqSectionQuestion
 * @param {string} eventId (path) The id of the event
 * @param {string} sectionId (path) The id of the section
 * @param {string} questionId (path) The id of the question
 * @version 1.3
 **/

export const EVENT_FAQ_SECTION_QUESTION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
) => [...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId), questionId];

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
    },
    "events"
  );
};
