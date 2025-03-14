import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Match } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_MATCH_QUERY_KEY } from "./useGetEventMatch";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_MATCH_PASSES_QUERY_KEY = (
  eventId: string,
  roundId: string,
  matchId: string
) => [...EVENT_MATCH_QUERY_KEY(eventId, roundId, matchId), "PASSES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_MATCH_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MATCH_PASSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMatchPasses>>
) => {
  client.setQueryData(EVENT_MATCH_PASSES_QUERY_KEY(...keyParams), response);
};

interface GetEventMatchPassesProps extends SingleQueryParams {
  eventId: string;
  roundId: string;
  matchId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventMatchPasses = async ({
  eventId,
  roundId,
  matchId,
  adminApiParams,
}: GetEventMatchPassesProps): Promise<ConnectedXMResponse<Match>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/rounds/${roundId}/matches/${matchId}/passes`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventMatchPasses = (
  eventId: string = "",
  roundId: string = "",
  matchId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventMatchPasses>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventMatchPasses>>(
    EVENT_MATCH_PASSES_QUERY_KEY(eventId, roundId, matchId),
    (params: SingleQueryParams) =>
      GetEventMatchPasses({ eventId, roundId, matchId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!roundId && !!matchId && (options?.enabled ?? true),
    },
    "events"
  );
};
