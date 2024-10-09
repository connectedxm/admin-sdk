import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionChoice } from "@src/interfaces";
import { EVENT_QUESTION_CHOICES_QUERY_KEY } from "./useGetEventQuestionChoices";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_CHOICE_QUERY_KEY = (
  eventId: string,
  questionId: string,
  choiceId: string
) => [...EVENT_QUESTION_CHOICES_QUERY_KEY(eventId, questionId), choiceId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestionChoice>>
) => {
  client.setQueryData(EVENT_QUESTION_CHOICE_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionChoiceProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestionChoice = async ({
  eventId,
  questionId,
  choiceId,
  adminApiParams,
}: GetEventQuestionChoiceProps): Promise<
  ConnectedXMResponse<RegistrationQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestionChoice = (
  eventId: string,
  questionId: string,
  choiceId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventQuestionChoice>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestionChoice>>(
    EVENT_QUESTION_CHOICE_QUERY_KEY(eventId, questionId, choiceId),
    (params: SingleQueryParams) =>
      GetEventQuestionChoice({ eventId, questionId, choiceId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!questionId && !!choiceId && (options?.enabled ?? true),
    },
    "events"
  );
};
