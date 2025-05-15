import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ROUND_MATCHES_QUERY_KEY } from "./useGetEventRoundMatches";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROUND_MATCH_QUERY_KEY = (
  eventId: string,
  roundId: string,
  matchId: string
) => [...EVENT_ROUND_MATCHES_QUERY_KEY(eventId, roundId), matchId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUND_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUND_MATCH_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRoundMatch>>
) => {
  client.setQueryData(EVENT_ROUND_MATCH_QUERY_KEY(...keyParams), response);
};

interface GetEventRoundMatchProps extends SingleQueryParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRoundMatch = async ({
  eventId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventRoundMatchProps): Promise<ConnectedXMResponse<Match>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRoundMatch = (
  eventId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRoundMatch>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRoundMatch>>(
    EVENT_ROUND_MATCH_QUERY_KEY(eventId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventRoundMatch({ eventId, roundId, matchId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!roundId && !!matchId && (options?.enabled ?? true),
    },
    "events"
  );
};
