import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { FAQ } from "@src/interfaces";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "./useGetEventFAQSectionQuestions";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_FAQ_SECTION_QUESTION_QUERY_KEY = (
  eventId: string,
  sectionId: string,
  questionId: string
) => [...EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId), questionId];

export const SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSectionQuestion>>
) => {
  client.setQueryData(
    EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventFAQSectionQuestionProps {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const GetEventFAQSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
}: GetEventFAQSectionQuestionProps): Promise<ConnectedXMResponse<FAQ>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`
  );
  return data;
};

const useGetEventFAQSectionQuestion = (
  eventId: string,
  sectionId: string,
  questionId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSectionQuestion>>((
    EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId),
    () =>
      GetEventFAQSectionQuestion({
        sectionId,
        eventId: eventId,
        questionId: questionId,
      }),
    {
      enabled: !!eventId && !!sectionId && !!questionId,
    }
  );
};

export default useGetEventFAQSectionQuestion;
