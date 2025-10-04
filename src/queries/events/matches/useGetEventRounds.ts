import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Round } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ROUNDS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ROUNDS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ROUNDS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ROUNDS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRounds>>
) => {
  client.setQueryData(EVENT_ROUNDS_QUERY_KEY(...keyParams), response);
};

interface GetEventRoundsProps extends SingleQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRounds = async ({
  eventId,
  adminApiParams,
}: GetEventRoundsProps): Promise<ConnectedXMResponse<Round[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/rounds`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRounds = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventRounds>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRounds>>(
    EVENT_ROUNDS_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetEventRounds({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
