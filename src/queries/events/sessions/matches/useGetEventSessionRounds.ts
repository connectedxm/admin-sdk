import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse, Round } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_QUERY_KEY } from "../useGetEventSession";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ROUNDS_QUERY_KEY = (
  eventId: string,
  sessionId: string
) => [...EVENT_SESSION_QUERY_KEY(eventId, sessionId), "ROUNDS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ROUNDS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_ROUNDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRounds>>
) => {
  client.setQueryData(EVENT_SESSION_ROUNDS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionRoundsProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionRounds = async ({
  eventId,
  sessionId,
  adminApiParams,
}: GetEventSessionRoundsProps): Promise<ConnectedXMResponse<Round[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/rounds`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionRounds = (
  eventId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionRounds>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionRounds>>(
    EVENT_SESSION_ROUNDS_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetEventSessionRounds({ eventId, sessionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sessionId && (options?.enabled ?? true),
    },
    "events"
  );
};
