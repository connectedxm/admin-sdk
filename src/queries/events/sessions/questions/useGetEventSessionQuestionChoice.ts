import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestionChoice } from "@src/interfaces";
import { EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY } from "./useGetEventSessionQuestionChoices";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string,
  choiceId: string
) => [
  ...EVENT_SESSION_QUESTION_CHOICES_QUERY_KEY(eventId, sessionId, questionId),
  choiceId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_CHOICE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestionChoice>>
) => {
  client.setQueryData(
    EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionQuestionChoiceProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
  choiceId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestionChoice = async ({
  eventId,
  sessionId,
  questionId,
  choiceId,
  adminApiParams,
}: GetEventSessionQuestionChoiceProps): Promise<
  ConnectedXMResponse<EventSessionQuestionChoice>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}/choices/${choiceId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionQuestionChoice = (
  eventId: string,
  sessionId: string,
  questionId: string,
  choiceId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionQuestionChoice>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionQuestionChoice>
  >(
    EVENT_SESSION_QUESTION_CHOICE_QUERY_KEY(
      eventId,
      sessionId,
      questionId,
      choiceId
    ),
    (params: SingleQueryParams) =>
      GetEventSessionQuestionChoice({
        eventId,
        sessionId,
        questionId,
        choiceId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!questionId &&
        !!choiceId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
