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
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_QUERY_KEY = (eventId: string, sessionId: string) => [
  ...EVENT_SESSIONS_QUERY_KEY(eventId),
  sessionId,
];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
    }
  );
};
