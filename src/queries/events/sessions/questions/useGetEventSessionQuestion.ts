import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventSessionQuestion } from "@src/interfaces";
import { EVENT_SESSION_QUESTIONS_QUERY_KEY } from "./useGetEventSessionQuestions";

/**
 * Fetches a specific question from an event session using the provided event, session, and question IDs.
 * This function is designed to retrieve detailed information about a particular question within an event session.
 * It is useful for applications that need to display or process data related to event session questions.
 * @name GetEventSessionQuestion
 * @param {string} eventId (path) The id of the event (path)
 * @param {string} sessionId (path) The id of the session (path)
 * @param {string} questionId (path) The id of the question (path)
 * @version 1.3
 **/

export const EVENT_SESSION_QUESTION_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  questionId: string
) => [...EVENT_SESSION_QUESTIONS_QUERY_KEY(eventId, sessionId), questionId];

export const SET_EVENT_SESSION_QUESTION_QUERY_DATA = (
  client: any,
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

export const useGetEventSessionQuestion = (
  eventId: string = "",
  sessionId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionQuestion>>(
    EVENT_SESSION_QUESTION_QUERY_KEY(eventId, sessionId, questionId),
    (params) =>
      GetEventSessionQuestion({ eventId, sessionId, questionId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!questionId && (options?.enabled || true),
    },
    "events"
  );
};
