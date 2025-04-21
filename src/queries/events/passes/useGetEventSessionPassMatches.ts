import { ConnectedXMResponse, Match } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSION_PASS_QUERY_KEY } from "./useGetEventSessionPass";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_PASS_MATCHES_QUERY_KEY = (
  eventId: string,
  sessionSessionPassId: string
) => [
  ...EVENT_SESSION_PASS_QUERY_KEY(eventId, sessionSessionPassId),
  "MATCHES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSION_PASS_MATCHES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPassMatches>>
) => {
  client.setQueryData(
    EVENT_SESSION_PASS_MATCHES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionPassMatchesProps extends SingleQueryParams {
  eventId: string;
  sessionPassId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionPassMatches = async ({
  eventId,
  sessionPassId,
  adminApiParams,
}: GetEventSessionPassMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sessionPasses/${sessionPassId}/matches`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionPassMatches = (
  eventId: string = "",
  sessionPassId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionPassMatches>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionPassMatches>>(
    EVENT_SESSION_PASS_MATCHES_QUERY_KEY(eventId, sessionPassId),
    (params: SingleQueryParams) =>
      GetEventSessionPassMatches({
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
