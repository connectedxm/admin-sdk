import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSession } from "@src/interfaces";
import { EVENT_SESSIONS_QUERY_KEY } from "./useGetEventSessions";

/**
 * Fetches detailed information about a specific event session using the event and session IDs.
 * This function is designed to retrieve data for a particular session within an event, 
 * providing essential details required for applications that manage or display event sessions.
 * @name GetEventSession
 * @param {string} eventId - The id of the event
 * @param {string} sessionId - The id of the session
 * @version 1.2
 **/

export const EVENT_SESSION_QUERY_KEY = (eventId: string, sessionId: string) => [
  ...EVENT_SESSIONS_QUERY_KEY(eventId),
  sessionId,
];

export const SET_EVENT_SESSION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSession>>
) => {
  client.setQueryData(EVENT_SESSION_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSession = async ({
  eventId,
  sessionId,
  adminApiParams,
}: GetEventSessionProps): Promise<ConnectedXMResponse<EventSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}`
  );
  return data;
};

export const useGetEventSession = (
  eventId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSession>>(
    EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    (params) => GetEventSession({ eventId, sessionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sessionId,
    },
    "events"
  );
};