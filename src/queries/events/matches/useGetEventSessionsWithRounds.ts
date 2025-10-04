import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, EventSession, Round } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSIONS_WITH_ROUNDS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SESSIONS_WITH_ROUNDS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_SESSIONS_WITH_ROUNDS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSIONS_WITH_ROUNDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionsWithRounds>>
) => {
  client.setQueryData(
    EVENT_SESSIONS_WITH_ROUNDS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSessionsWithRoundsProps extends SingleQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionsWithRounds = async ({
  eventId,
  adminApiParams,
}: GetEventSessionsWithRoundsProps): Promise<
  ConnectedXMResponse<(EventSession & { rounds: Round[] })[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/all-sessions/rounds`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionsWithRounds = (
  eventId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionsWithRounds>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionsWithRounds>>(
    EVENT_SESSIONS_WITH_ROUNDS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventSessionsWithRounds({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
