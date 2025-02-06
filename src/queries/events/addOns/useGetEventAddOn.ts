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
 * Fetches details of a specific event add-on by its unique identifiers.
 * This function is used to retrieve detailed information about an add-on associated with a particular event.
 * It is designed for applications that require access to event add-on data.
 * @name GetEventAddOn
 * @param {string} eventId (path) - The id of the event
 * @param {string} addOnId (path) - The id of the add-on
 * @version 1.3
 **/

export const EVENT_ADD_ON_QUERY_KEY = (eventId: string, addOnId: string) => [
  ...EVENT_ADD_ONS_QUERY_KEY(eventId),
  addOnId,
];

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

export const GetEventAddOn = async ({
  eventId,
  addOnId,
  adminApiParams,
}: GetEventAddOnProps): Promise<ConnectedXMResponse<EventAddOn>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns/${addOnId}`);
  return data;
};

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
    },
    "events"
  );
};