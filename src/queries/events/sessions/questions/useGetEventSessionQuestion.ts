import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionQuestion } from "@src/interfaces";
import { EVENT_SESSION_QUESTIONS_QUERY_KEY } from "./useGetEventSessionQuestions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUESTION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [...EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId), questionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionQuestion>>
) => {
  client.setQueryData(EVENT_SESSION_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionQuestionProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionQuestion = async ({
  eventId,
  sessionId,
  questionId,
  adminApiParams,
}: GetEventSessionQuestionProps): Promise<
  ConnectedXMResponse<EventSessionQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/questions/${questionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionQuestion = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionQuestion>>(
    EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
    (params: SingleQueryParams) =>
      GetEventSessionQuestion({ eventId, sessionId, questionId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
