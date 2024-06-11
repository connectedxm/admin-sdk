import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Session } from "@src/interfaces";
import { EVENT_SESSIONS_QUERY_KEY } from "./useGetEventSessions";

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
}: GetEventSessionProps): Promise<ConnectedXMResponse<Session>> => {
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
    }
  );
};
