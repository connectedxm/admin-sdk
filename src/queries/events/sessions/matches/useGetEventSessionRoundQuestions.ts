import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, RoundSessionQuestion } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "./useGetEventSessionRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string
) => [
  ...EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
  roundId,
  "QUESTIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundQuestions>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundQuestionsProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRoundQuestions = async ({
  eventId,
  sessionId,
  roundId,
  adminApiParams,
}: GetEventSessionRoundQuestionsProps): Promise<
  ConnectedXMResponse<RoundSessionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionRoundQuestions = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRoundQuestions>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRoundQuestions>
  >(
    EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY(eventId, sessionId, roundId),
    (params: SingleQueryParams) =>
      GetEventSessionRoundQuestions({ eventId, sessionId, roundId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options?.enabled ?? true),
    },
    "events"
  );
};
