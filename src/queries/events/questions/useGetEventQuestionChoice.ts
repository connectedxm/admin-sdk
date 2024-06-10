import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoice } from "@src/interfaces";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "./useGetEventQuestionChoices";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_QUESTION_CHOICE_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [...EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId), choiceId];

export const SET_EVENT_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoice>>
) => {
  client.setQueryData(EVENT_QUESTION_CHOICE_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionChoiceProps {
  eventId: string;
  questionId: string;
  choiceId: string;
}

export const GetEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
}: GetEventQuestionChoiceProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};

const useGetEventQuestionChoice = (
  eventId: string,
  questionId: string,
  choiceId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionChoice>>((
    EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
    () => GetEventQuestionChoice({ eventId, questionId, choiceId }),
    {
      enabled: !!eventId && !!questionId && !!choiceId,
    }
  );
};

export default useGetEventQuestionChoice;
