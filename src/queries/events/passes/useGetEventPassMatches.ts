import { ConnectedXMResponse, Match } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASS_QUERY_KEY } from "./useGetEventPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_MATCHES_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId?: string,
  roundId?: string
) => {
  const keys = [...EVENT_PASS_QUERY_KEY(eventId, passId), "MATCHES"];
  if (sessionId) {
    keys.push(sessionId);
  }
  if (roundId) {
    keys.push(roundId);
  }
  return keys;
};

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_MATCHES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassMatches>>
) => {
  client.setQueryData(EVENT_PASS_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventPassMatchesProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionId?: string;
  roundId?: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassMatches = async ({
  eventId,
  passId,
  sessionId,
  roundId,
  adminApiParams,
}: GetEventPassMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/matches`,
    { params: { roundId, sessionId } }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassMatches = (
  eventId: string = "",
  passId: string = "",
  sessionId?: string,
  roundId?: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventPassMatches>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassMatches>>(
    EVENT_PASS_MATCHES_QUERY_KEY(eventId, passId, roundId),
    (params: SingleQueryParams) =>
      GetEventPassMatches({
        eventId,
        passId,
        sessionId,
        roundId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    },
    "events"
  );
};
