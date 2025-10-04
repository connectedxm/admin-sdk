import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_ACCESSES_QUERY_KEY } from "..";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_ACCESS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  passId: string
) => [...EVENT_SESSION_ACCESSES_QUERY_KEY(eventId, sessionId), passId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_ACCESS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_ACCESS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionAccess>>
) => {
  client.setQueryData(EVENT_SESSION_ACCESS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionAccessProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionAccess = async ({
  eventId,
  sessionId,
  passId,
  adminApiParams,
}: GetEventSessionAccessProps): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionAccess = (
  eventId: string = "",
  sessionId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionAccess>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionAccess>>(
    EVENT_SESSION_ACCESS_QUERY_KEY(eventId, sessionId, passId),
    (params: SingleQueryParams) =>
      GetEventSessionAccess({
        eventId,
        sessionId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!sessionId && !!passId && (options?.enabled ?? true),
    }
  );
};
