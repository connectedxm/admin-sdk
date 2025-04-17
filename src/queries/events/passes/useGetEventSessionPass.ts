import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "../sessions";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PASS_QUERY_KEY = (
  eventId: string,
  sessionPassId: string
) => [...EVENT_SESSIONS_QUERY_KEY(eventId), "SESSION_PASSES", sessionPassId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PASS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPass>>
) => {
  client.setQueryData(EVENT_SESSION_PASS_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionPassProps extends SingleQueryParams {
  eventId: string;
  sessionPassId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPass = async ({
  eventId,
  sessionPassId,
  adminApiParams,
}: GetEventSessionPassProps): Promise<
  ConnectedXMResponse<EventSessionPass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionPasses/${sessionPassId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionPass = (
  eventId: string = "",
  sessionPassId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionPass>>(
    EVENT_SESSION_PASS_QUERY_KEY(eventId, sessionPassId),
    (params: SingleQueryParams) =>
      GetEventSessionPass({
        eventId,
        sessionPassId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!sessionPassId && (options?.enabled ?? true),
    },
    "events"
  );
};
