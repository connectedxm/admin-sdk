import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_MATCHES_QUERY_KEY } from "./useGetEventMatches";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MATCH_QUERY_KEY = (
  eventId: string,
  roundId: string,
  matchId: string
) => [...EVENT_MATCHES_QUERY_KEY(eventId, roundId), matchId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MATCH_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMatch>>
) => {
  client.setQueryData(EVENT_MATCH_QUERY_KEY(...keyParams), response);
};

interface GetEventMatchProps extends SingleQueryParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMatch = async ({
  eventId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventMatchProps): Promise<ConnectedXMResponse<Match>> => {
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
export const useGetEventMatch = (
  eventId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventMatch>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventMatch>>(
    EVENT_MATCH_QUERY_KEY(eventId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventMatch({ eventId, roundId, matchId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!roundId && !!matchId && (options?.enabled ?? true),
    },
    "events"
  );
};
