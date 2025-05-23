import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_ROUND_MATCHES_QUERY_KEY } from "./useGetEventSessionRoundMatches";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_MATCH_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [
  ...EVENT_SESSION_ROUND_MATCHES_QUERY_KEY(eventId, sessionId, roundId),
  matchId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_MATCH_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRoundMatch>>
) => {
  client.setQueryData(
    EVENT_SESSION_ROUND_MATCH_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionRoundMatchProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRoundMatch = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventSessionRoundMatchProps): Promise<ConnectedXMResponse<Match>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionRoundMatch = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionRoundMatch>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionRoundMatch>>(
    EVENT_SESSION_ROUND_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventSessionRoundMatch({
        eventId,
        sessionId,
        roundId,
        matchId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId &&
        !!sessionId &&
        !!roundId &&
        !!matchId &&
        (options?.enabled ?? true),
    },
    "events"
  );
};
