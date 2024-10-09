import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestion } from "@src/interfaces";
import { EVENT_QUESTIONS_QUERY_KEY } from "./useGetEventQuestions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_QUESTION_QUERY_KEY = (
  eventId: string,
  questionId: string
) => [...EVENT_QUESTIONS_QUERY_KEY(eventId), questionId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_QUESTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUESTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventQuestion>>
) => {
  client.setQueryData(EVENT_QUESTION_QUERY_KEY(...keyParams), response);
};

interface GetEventQuestionProps extends SingleQueryParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventQuestion = async ({
  eventId,
  questionId,
  adminApiParams,
}: GetEventQuestionProps): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/questions/${questionId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventQuestion = (
  eventId: string = "",
  questionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventQuestion>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventQuestion>>(
    EVENT_QUESTION_QUERY_KEY(eventId, questionId),
    (params: SingleQueryParams) =>
      GetEventQuestion({ eventId, questionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!questionId && (options?.enabled ?? true),
    },
    "events"
  );
};
