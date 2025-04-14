import { ConnectedXMResponse, EventSessionPass } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASS_SESSION_PASSES_QUERY_KEY } from "./useGetEventPassSessionPasses";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_SESSION_PASS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionPassId: string
) => [...EVENT_PASS_SESSION_PASSES_QUERY_KEY(eventId, passId), sessionPassId];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PASS_SESSION_PASS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_SESSION_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassSessionPass>>
) => {
  client.setQueryData(
    EVENT_PASS_SESSION_PASS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPassSessionPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  sessionPassId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPassSessionPass = async ({
  eventId,
  passId,
  sessionPassId,
  adminApiParams,
}: GetEventPassSessionPassProps): Promise<
  ConnectedXMResponse<EventSessionPass>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passes/${passId}/sessionPasses/${sessionPassId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPassSessionPass = (
  eventId: string = "",
  passId: string = "",
  sessionPassId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPassSessionPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassSessionPass>>(
    EVENT_PASS_SESSION_PASS_QUERY_KEY(eventId, passId, sessionPassId),
    (params: SingleQueryParams) =>
      GetEventPassSessionPass({
        eventId,
        passId,
        sessionPassId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!passId && !!sessionPassId && (options?.enabled ?? true),
    },
    "events"
  );
};
