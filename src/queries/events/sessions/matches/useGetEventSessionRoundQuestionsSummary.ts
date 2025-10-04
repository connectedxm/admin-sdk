import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, MatchQuestionType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY } from "./useGetEventSessionRoundQuestions";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_QUESTIONS_SUMMARY_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string
) => [
  ...EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY(eventId, sessionId, roundId),
  "SUMMARY",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_QUESTIONS_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_QUESTIONS_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundQuestionsSummary>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_QUESTIONS_SUMMARY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundQuestionsSummaryProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRoundQuestionsSummary = async ({
  eventId,
  sessionId,
  roundId,
  adminApiParams,
}: GetEventSessionRoundQuestionsSummaryProps): Promise<
  ConnectedXMResponse<Record<string, keyof typeof MatchQuestionType>>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions/summary`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionRoundQuestionsSummary = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRoundQuestionsSummary>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRoundQuestionsSummary>
  >(
    EVENT_SESSION_ROUND_QUESTIONS_SUMMARY_QUERY_KEY(
      eventId,
      sessionId,
      roundId
    ),
    (params: SingleQueryParams) =>
      GetEventSessionRoundQuestionsSummary({
        eventId,
        sessionId,
        roundId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options.enabled ?? true),
    }
  );
};
