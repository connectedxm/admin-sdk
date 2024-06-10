import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestion } from "@src/interfaces";
import { EVENT_QUESTIONS_QUERY_KEY } from "./useGetEventQuestions";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_QUESTION_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTIONS_QUERY_KEY(eventId), questionId];

export const SET_EVENT_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestion>>
) => {
  client.setQueryData(EVENT_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionProps {
  eventId: string;
  questionId: string;
}

export const GetEventQuestion = async ({
  eventId,
  questionId,
}: GetEventQuestionProps): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}`
  );
  return data;
};

const useGetEventQuestion = (eventId: string, questionId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestion>>(
    EVENT_QUESTION_QUERY_KEY(eventId, questionId),
    () => GetEventQuestion({ eventId, questionId }),
    {
      enabled: !!eventId && !!questionId,
    }
  );
};

export default useGetEventQuestion;
