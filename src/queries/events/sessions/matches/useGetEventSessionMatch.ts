import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_MATCHES_QUERY_KEY } from "./useGetEventSessionMatches";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_MATCH_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [...EVENT_SESSION_MATCHES_QUERY_KEY(eventId, sessionId, roundId), matchId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_MATCH_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionMatch>>
) => {
  client.setQueryData(EVENT_SESSION_MATCH_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionMatchProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionMatch = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventSessionMatchProps): Promise<ConnectedXMResponse<Match>> => {
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
export const useGetEventSessionMatch = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionMatch>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionMatch>>(
    EVENT_SESSION_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventSessionMatch({ eventId, sessionId, roundId, matchId, ...params }),
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
