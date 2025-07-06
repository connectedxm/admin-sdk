import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MatchQuestionType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ROUND_QUESTIONS_QUERY_KEY } from "./useGetEventRoundQuestions";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROUND_QUESTIONS_SUMMARY_QUERY_KEY = (
  eventId: string,
  roundId: string
) => [...EVENT_ROUND_QUESTIONS_QUERY_KEY(eventId, roundId), "SUMMARY"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_QUESTIONS_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_QUESTIONS_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundQuestionsSummary>>
) => {
  client.setQueryData(
    EVENT_ROUND_QUESTIONS_SUMMARY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRoundQuestionsSummaryProps extends SingleQueryParams {
  eventId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundQuestionsSummary = async ({
  eventId,
  roundId,
  adminApiParams,
}: GetEventRoundQuestionsSummaryProps): Promise<
  ConnectedXMResponse<Record<string, keyof typeof MatchQuestionType>>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/questions/summary`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRoundQuestionsSummary = (
  eventId: string = "",
  roundId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRoundQuestionsSummary>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRoundQuestionsSummary>
  >(
    EVENT_ROUND_QUESTIONS_SUMMARY_QUERY_KEY(eventId, roundId),
    (params: SingleQueryParams) =>
      GetEventRoundQuestionsSummary({
        eventId,
        roundId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!roundId && (options.enabled ?? true),
    },
    "events"
  );
};
