import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, RoundEventQuestion } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ROUNDS_QUERY_KEY } from "./useGetEventRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROUND_QUESTIONS_QUERY_KEY = (
  eventId: string,
  roundId: string
) => [...EVENT_ROUNDS_QUERY_KEY(eventId), roundId, "QUESTIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundQuestions>>
) => {
  client.setQueryData(EVENT_ROUND_QUESTIONS_QUERY_KEY(...keyParams), response);
};

interface GetEventRoundQuestionsProps extends SingleQueryParams {
  eventId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundQuestions = async ({
  eventId,
  roundId,
  adminApiParams,
}: GetEventRoundQuestionsProps): Promise<
  ConnectedXMResponse<RoundEventQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/questions`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRoundQuestions = (
  eventId: string = "",
  roundId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRoundQuestions>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRoundQuestions>>(
    EVENT_ROUND_QUESTIONS_QUERY_KEY(eventId, roundId),
    (params: SingleQueryParams) =>
      GetEventRoundQuestions({ eventId, roundId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!roundId && (options?.enabled ?? true),
    },
    "events"
  );
};
