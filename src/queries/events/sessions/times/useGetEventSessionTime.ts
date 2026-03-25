import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionTime } from "@src/interfaces";
import { EVENT_SESSION_TIMES_QUERY_KEY } from "./useGetEventSessionTimes";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_TIME_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  timeId: string
) => [...EVENT_SESSION_TIMES_QUERY_KEY(eventId, sessionId), timeId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_TIME_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_TIME_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionTime>>
) => {
  client.setQueryData(EVENT_SESSION_TIME_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionTimeProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  timeId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionTime = async ({
  eventId,
  sessionId,
  timeId,
  adminApiParams,
}: GetEventSessionTimeProps): Promise<
  ConnectedXMResponse<EventSessionTime>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/times/${timeId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionTime = (
  eventId: string = "",
  sessionId: string = "",
  timeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionTime>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionTime>>(
    EVENT_SESSION_TIME_QUERY_KEY(eventId, sessionId, timeId),
    (params: SingleQueryParams) =>
      GetEventSessionTime({ eventId, sessionId, timeId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!timeId && (options?.enabled ?? true),
    }
  );
};
