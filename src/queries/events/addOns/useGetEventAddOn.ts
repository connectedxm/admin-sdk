import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_ADD_ONS_QUERY_KEY } from "./useGetEventAddOns";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ADD_ON_QUERY_KEY = (eventId: string, addOnId: string) => [
  ...EVENT_ADD_ONS_QUERY_KEY(eventId),
  addOnId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ADD_ON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ADD_ON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAddOn>>
) => {
  client.setQueryData(EVENT_ADD_ON_QUERY_KEY(...keyParams), response);
};

interface GetEventAddOnProps extends SingleQueryParams {
  eventId: string;
  addOnId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAddOn = async ({
  eventId,
  addOnId,
  adminApiParams,
}: GetEventAddOnProps): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns/${addOnId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAddOn = (
  eventId: string = "",
  addOnId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAddOn>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAddOn>>(
    EVENT_ADD_ON_QUERY_KEY(eventId, addOnId),
    (params: SingleQueryParams) =>
      GetEventAddOn({ eventId, addOnId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!addOnId && (options?.enabled ?? true),
    }
  );
};
