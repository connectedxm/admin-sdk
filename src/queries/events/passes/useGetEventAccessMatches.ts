import { ConnectedXMResponse, Match } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_ACCESS_QUERY_KEY } from "./useGetEventAccess";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACCESS_MATCHES_QUERY_KEY = (
  eventId: string,
  sessionAccessId: string
) => [...EVENT_ACCESS_QUERY_KEY(eventId, sessionAccessId), "MATCHES"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACCESS_MATCHES_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACCESS_MATCHES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAccessMatches>>
) => {
  client.setQueryData(EVENT_ACCESS_MATCHES_QUERY_KEY(...keyParams), response);
};

interface GetEventAccessMatchesProps extends SingleQueryParams {
  eventId: string;
  accessId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAccessMatches = async ({
  eventId,
  accessId,
  adminApiParams,
}: GetEventAccessMatchesProps): Promise<ConnectedXMResponse<Match[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/accesses/${accessId}/matches`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAccessMatches = (
  eventId: string = "",
  accessId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAccessMatches>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAccessMatches>>(
    EVENT_ACCESS_MATCHES_QUERY_KEY(eventId, accessId),
    (params: SingleQueryParams) =>
      GetEventAccessMatches({
        eventId,
        accessId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!accessId && (options?.enabled ?? true),
    },
    "events"
  );
};
