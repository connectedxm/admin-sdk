import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BaseTier } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TIERS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "TIERS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTiers>>
) => {
  client.setQueryData(EVENT_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventTiersProps extends SingleQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTiers = async ({
  eventId,
  adminApiParams,
}: GetEventTiersProps): Promise<ConnectedXMResponse<BaseTier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/tiers`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTiers = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTiers>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTiers>>(
    EVENT_TIERS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventTiers({
        ...params,
        eventId,
      }),
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
