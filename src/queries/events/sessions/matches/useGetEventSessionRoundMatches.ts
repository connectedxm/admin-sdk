import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "./useGetEventSessionRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_MATCHES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string
) => [
  ...EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
  roundId,
  "MATCHES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_MATCHES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundMatches>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundMatchesProps extends InfiniteQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRoundMatches = async ({
  eventId,
  sessionId,
  roundId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSessionRoundMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches`,
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
export const useGetEventSessionRoundMatches = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSessionRoundMatches>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSessionRoundMatches>>
  >(
    EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(eventId, sessionId, roundId),
    (params: InfiniteQueryParams) =>
      GetEventSessionRoundMatches({
        eventId,
        sessionId,
        roundId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options?.enabled ?? true),
    },
    "events"
  );
};
