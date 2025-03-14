import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_MATCH_QUERY_KEY } from "./useGetEventSessionMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_MATCH_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string,
  matchId: string
) => [
  ...EVENT_SESSION_MATCH_QUERY_KEY(eventId, sessionId, roundId, matchId),
  "SESSION_PASSES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_MATCH_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionMatchSessionPasses>>
) => {
  client.setQueryData(
    EVENT_SESSION_MATCH_PASSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionMatchSessionPassesProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionMatchSessionPasses = async ({
  eventId,
  sessionId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventSessionMatchSessionPassesProps): Promise<
  ConnectedXMResponse<EventSessionPass[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}/matches/${matchId}/sessionPasses`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionMatchSessionPasses = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionMatchSessionPasses>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionMatchSessionPasses>
  >(
    EVENT_SESSION_MATCH_PASSES_QUERY_KEY(eventId, sessionId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventSessionMatchSessionPasses({
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
