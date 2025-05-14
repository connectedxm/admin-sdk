import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match, Round } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_ROUNDS_QUERY_KEY } from "./useGetEventSessionRounds";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUND_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  roundId: string
) => [...EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId), roundId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUND_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUND_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRound>>
) => {
  client.setQueryData(EVENT_SESSION_ROUND_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionRoundProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  roundId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRound = async ({
  eventId,
  sessionId,
  roundId,
  adminApiParams,
}: GetEventSessionRoundProps): Promise<ConnectedXMResponse<Round>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds/${roundId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionRound = (
  eventId: string = "",
  sessionId: string = "",
  roundId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionRound>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionRound>>(
    EVENT_SESSION_ROUND_QUERY_KEY(eventId, sessionId, roundId),
    (params: SingleQueryParams) =>
      GetEventSessionRound({ eventId, sessionId, roundId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!roundId && (options?.enabled ?? true),
    },
    "events"
  );
};
