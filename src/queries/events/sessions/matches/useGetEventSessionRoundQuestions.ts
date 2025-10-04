import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
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

interface GetEventSessionRoundQuestionsProps extends InfiniteQueryParams {
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
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionRoundQuestionsProps): Promise<
  ConnectedXMResponse<RoundSessionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/questions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
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
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionRoundQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionRoundQuestions>>
  >(
    EVENT_SESSION_ROUND_QUESTIONS_QUERY_KEY(eventId, sessionId, roundId),
    (queryParams: InfiniteQueryParams) =>
      GetEventSessionRoundQuestions({
        ...queryParams,
        eventId,
        sessionId,
        roundId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options.enabled ?? true),
    }
  );
};
